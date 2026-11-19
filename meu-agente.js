import Anthropic from "@anthropic-ai/sdk";

process.loadEnvFile();

const cliente = new Anthropic();

const resposta = await cliente.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 2000,
    messages: [
       {
            role: 'user',
            content: 'Defina o que é teste flaky em uma frase curta.'
       }
    ]
});

console.log(resposta.content);
console.log(resposta.stop_reason);
console.log(resposta.usage);