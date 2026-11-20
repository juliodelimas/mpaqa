import fs from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

process.loadEnvFile();

const executarFerramenta = {
    lerHeuristica: () => fs.readFileSync('heuristica.md', 'utf8'),
    lerArquivoTeste: ({ caminho }) => fs.readFileSync(caminho, 'utf8'),
    salvarRelatorio: ({ nome, conteudo }) => {
        fs.mkdirSync('relatorio', { recursive: true });
        fs.writeFileSync('relatorio/' + nome, conteudo);
    }
}

const definicaoFerramentas = [
    {
        name: 'lerHeuristica',
        description: 'Lê o arquivo heuristica.md e devolve seu conteúdo em texto. Use antes de analisar qualquer arquivo de teste, para conhecer os critérios de avaliação.',
        strict: true,
        input_schema: {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false
        }
    },
    {
        name: 'lerArquivoTeste',
        description: 'Lê um arquivo de teste e devolve seu conteúdo em texto (UTF-8). Use para obter o código do teste que será avaliado com base na heurística.',
        strict: true,
        input_schema: {
            type: 'object',
            properties: {
                caminho: {
                    type: 'string',
                    description: 'Caminho do arquivo de teste, relativo à raiz do projeto. Ex.: exemplos/login.api.test.js'
                }
            },
            required: ['caminho'],
            additionalProperties: false
        }
    },
    {
        name: 'salvarRelatorio',
        description: 'Salva o relatório da análise na pasta relatorio/, criando a pasta se necessário. Sobrescreve um arquivo com o mesmo nome. Use ao final, depois de analisar o arquivo de teste.',
        strict: true,
        input_schema: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string',
                    description: 'Nome do arquivo do relatório, sem pastas. Ex.: login.api.test.md'
                },
                conteudo: {
                    type: 'string',
                    description: 'Conteúdo completo do relatório em Markdown.'
                }
            },
            required: ['nome', 'conteudo'],
            additionalProperties: false
        }
    }
];

const numeroMaximoIteracoes = 10;
const caminhoDoArquivo = process.argv[2];
const systemPrompt = `
    Você é um agente de QA que avalia a qualidade de scripts de teste automatizados.
    Workflow:
    1. Leia o arquivo de heuristica de teste
    2. Leia o conteúdo do arquivo de testes automatizados requerido pelo usuário
    3. Dê uma nota de 0 a 5 para cada critério e cite a linha do arquivo
    4. Salve os resultados em um arquivo como um relatório .md contendo:
        a. Nota final
        b. Tabela com os critérios
        c. Evidências 
        d. Plano de melhoria do arquivo de teste
    5. Responda com uma única linha: arquivo, nota e classificação. 
        Escreva em português. Não invente informações, trabalhe apenas 
        com fatos.
`;

const client = new Anthropic();

const mensagens = [
    {
        role: 'user',
        content: 'Avalie o script de teste ' + caminhoDoArquivo
    }
];

for (let iteracao = 1; iteracao <= numeroMaximoIteracoes; iteracao++) {
    const resposta = await client.messages.create({
        model: 'claude-opus-5-5',
        max_tokens: 15000,
        system: systemPrompt,
        tools: definicaoFerramentas,
        messages: mensagens
    });

    mensagens.push({
        role: 'assistant',
        content: resposta.content
    });

    if (resposta.stop_reason !== 'tool_use') {
        console.log(resposta.content.find(item => item.type === 'text').text);
        break;
    }

    // Executar as ferramentas que foram requisitadas pelo modelo
    const resultadoDaExecucaoDasFerramentas = [];

    for (const ferramentaPedida of resposta.content) {
        if (ferramentaPedida.type === 'tool_use') {
            resultadoDaExecucaoDasFerramentas.push({
                type: 'tool_result',
                tool_use_id: ferramentaPedida.id,
                content: String(executarFerramenta[ferramentaPedida.name](ferramentaPedida.input))
            });
        }
    }

    mensagens.push({
        role: 'user',
        content: resultadoDaExecucaoDasFerramentas
    });
}