# Heurística de qualidade de scripts de teste

Dê uma nota de **0 a 5** para cada critério. Toda nota abaixo de 5 precisa de
uma evidência com o número da linha (ex.: `linha 25: await sleep(3000)`).

**Nota final (0–100)** = soma de `(nota ÷ 5) × peso`.

| ID | Critério                   | Peso | Pergunta-guia                                         | Sinais de alerta                                          |
| -- | -------------------------- | ---- | ----------------------------------------------------- | --------------------------------------------------------- |
| C1 | Clareza de intenção        | 15   | Só pelo nome, entendo o que o teste verifica?          | `it('teste 1')`, testes longos que verificam várias coisas |
| C2 | Asserções significativas   | 20   | Se o sistema quebrar, o teste falha?                   | sem `expect`, só status code, `try/catch` que engole erro  |
| C3 | Independência              | 15   | Roda sozinho e em qualquer ordem?                      | variável preenchida em um teste e usada no próximo         |
| C4 | Determinismo (anti-flaky)  | 15   | Dá o mesmo resultado 100 vezes seguidas?               | `sleep`, `waitForTimeout`, `new Date()`, `Math.random()`   |
| C5 | Dados de teste             | 10   | Os dados são seguros e fáceis de trocar?               | senha ou token no código, URL de produção, número mágico   |
| C6 | Manutenibilidade           | 10   | Se a tela/API mudar, altero em um lugar só?            | código copiado e colado, seletor frágil (`nth-child`)      |
| C7 | Cobertura de cenários      | 10   | Cobre mais que o caminho feliz?                        | nenhum cenário negativo ou de limite                       |
| C8 | Higiene                    | 5    | Está pronto para a pipeline?                           | `.only`/`.skip` esquecido, `console.log`, código comentado |

## Classificação

| Nota final | Classificação |
| ---------- | ------------- |
| 85–100     | Excelente     |
| 70–84      | Bom           |
| 50–69      | Regular       |
| 0–49       | Crítico       |

## Plano de melhoria

Liste as ações da prioridade **alta** (afeta a confiança no resultado) para a
**baixa** (estilo). Cada ação diz o que fazer, por quê, e traz um trecho curto
de código "depois" quando ajudar.
