import fs from 'node:fs';

const executarFerramenta = {
    lerHeuristica: () => fs.readFileSync('heuristica.md', 'utf8'),
    lerArquivoTeste: (caminho) => fs.readFileSync(caminho, 'utf8'),
    salvarRelatorio: (nome, conteudo) => {
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

