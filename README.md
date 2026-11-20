# MPAQA — Agente de QA que avalia scripts de teste

Agente em Node.js, construído com o SDK da Anthropic, que lê um script de teste
automatizado, aplica uma heurística de qualidade e gera um relatório em Markdown
com nota, evidências e plano de melhoria.

## Como funciona

O agente roda um loop de *tool use* (até 10 iterações) com o modelo
`claude-opus-5-5`. A cada volta, o modelo decide qual ferramenta chamar:

| Ferramenta        | O que faz                                                        |
| ----------------- | ---------------------------------------------------------------- |
| `lerHeuristica`   | Lê o arquivo `heuristica.md` com os critérios de avaliação       |
| `lerArquivoTeste` | Lê o script de teste informado pelo usuário                      |
| `salvarRelatorio` | Grava o relatório `.md` na pasta `relatorio/`                    |

Fluxo:

1. Lê a heurística.
2. Lê o arquivo de teste.
3. Dá uma nota de 0 a 5 para cada critério, citando a linha do arquivo.
4. Salva um relatório com nota final, tabela de critérios, evidências e plano de melhoria.
5. Responde no terminal com uma linha: arquivo, nota e classificação.

## Heurística

Os critérios estão em [`heuristica.md`](heuristica.md). Cada um tem um peso, e a
nota final vai de 0 a 100:

| ID | Critério                  | Peso |
| -- | ------------------------- | ---- |
| C1 | Clareza de intenção       | 15   |
| C2 | Asserções significativas  | 20   |
| C3 | Independência             | 15   |
| C4 | Determinismo (anti-flaky) | 15   |
| C5 | Dados de teste            | 10   |
| C6 | Manutenibilidade          | 10   |
| C7 | Cobertura de cenários     | 10   |
| C8 | Higiene                   | 5    |

Classificação: **Excelente** (85–100), **Bom** (70–84), **Regular** (50–69),
**Crítico** (0–49).

Para mudar o que o agente avalia, basta editar `heuristica.md`. Não é preciso
mexer no código.

## Pré-requisitos

- Node.js 20.12 ou superior (o projeto usa `process.loadEnvFile()`)
- Uma chave de API da Anthropic

## Instalação

```bash
npm install
cp .env.example .env
```

## Uso

```bash
node node agente.js "exemplos/carrinho.api.test.js" 
```

## Analizando o Resultado

Após a execução, uma mensagem será apresentada no terminal:

```bash
exemplos/carrinho.api.test.js: 87/100, Excelente (a ferramenta não confirmou que relatorio/carrinho.api.test.md foi salvo).
```

E o relatório completo será apresentado na pasta relatório, pasta essa que será criada após a execução do agente.

## Licença

MIT