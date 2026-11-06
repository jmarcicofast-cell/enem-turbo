# Como ativar o ENEM Turbo Pro

O app já está no ar. Este passo a passo liga as três partes que precisam do servidor:
a correção de redação com IA, o pagamento pelo **Asaas** e a liberação do Pro.
Faça uma vez só. Leva cerca de 30 a 40 minutos.

## 1. Plano Blaze no Firebase
O Firebase só roda funções de servidor no plano Blaze (pago por uso, com cota grátis mensal).

1. Abra o console do Firebase e entre no projeto **enem-turbo**.
2. No canto inferior esquerdo, clique em **Fazer upgrade** e escolha **Blaze**.
3. Crie um **alerta de orçamento** (por exemplo, R$ 50) para ser avisada se o gasto subir.

## 2. Chave da IA (Claude)
1. Entre em **console.anthropic.com**, crie a conta e adicione créditos em **Billing**.
2. Em **API Keys**, clique em **Create Key** e copie a chave (começa com `sk-ant-`).
3. Os preços por uso ficam em **docs.claude.com** (página de preços). Cada correção usa uma chamada.

## 3. Chave do Asaas
1. Para **testar** primeiro, crie uma conta no **sandbox do Asaas** (ambiente de testes, sem dinheiro real).
2. Na conta (de teste ou a real), vá em **Integrações → Chave de API** e gere a chave.
   - Chave de teste começa com `$aact_hmlg_`. Chave real começa com `$aact_prod_`.
   - O servidor percebe sozinho qual é e usa o endereço certo.
3. Em **Minha conta → Informações**, cadastre o site `jmarcicofast-cell.github.io`.
   Sem isso, o Asaas não devolve a pessoa para o app depois do pagamento (o Pro libera do mesmo jeito).
4. Invente um **token do webhook**: uma senha longa só de letras e números (ex.: `enemTurbo2026XyZ9kQ`). Guarde, você vai usar 2 vezes.

## 4. Publicar o servidor (pelo navegador, sem instalar nada)
1. Abra **shell.cloud.google.com** com a mesma conta Google do Firebase.
2. Cole estes comandos, um de cada vez:

```bash
git clone https://github.com/jmarcicofast-cell/enem-turbo
cd enem-turbo/functions && npm install && cd ..
npx firebase-tools login --no-localhost
npx firebase-tools functions:secrets:set ANTHROPIC_API_KEY
npx firebase-tools functions:secrets:set ASAAS_API_KEY
npx firebase-tools functions:secrets:set ASAAS_WEBHOOK_TOKEN
npx firebase-tools deploy --only functions,firestore:rules
```

- No `login`, abra o link que aparece, autorize e cole o código de volta.
- Em cada `secrets:set`, cole o valor correspondente e aperte Enter (no último, o token que você inventou).
- No `deploy`, quando perguntar **ADMIN_EMAILS**, digite o seu e-mail de login no app.
  Nas outras perguntas, só aperte Enter para usar o valor padrão.

## 5. Ligar o aviso de pagamento (webhook) no Asaas
1. No Asaas, vá em **Integrações → Webhooks → Adicionar**.
2. Preencha:
   - **URL:** `https://southamerica-east1-enem-turbo-ceb3c.cloudfunctions.net/webhookAsaas`
   - **Token de autenticação:** o mesmo token que você inventou no passo 3.
   - **Versão da API:** v3 · **Tipo de envio:** sequencial · **Ativo:** sim
   - **Eventos:** Cobranças → `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_REFUNDED`, `PAYMENT_CHARGEBACK_REQUESTED`
3. Salve. Se um dia aparecer "fila pausada", reative a fila nessa mesma tela.

## 6. Liberar o Pro para as suas irmãs
1. Elas criam a conta no app normalmente.
2. Você entra no app com o seu e-mail e abre **jmarcicofast-cell.github.io/enem-turbo/admin.html**.
3. Digite o e-mail de cada uma e quantos dias de Pro quer dar.

## 6b. Cupons de desconto
Na mesma página **admin.html** há a parte **Cupons de desconto**: escolha o código, se é % ou R$, validade, limite de usos e para quais planos vale.
No app, a pessoa toca em **Tenho um cupom de desconto** na tela do Pro e vê o preço novo.
Depois de atualizar o código do servidor, rode de novo o `deploy` (passo 4, só o último comando) para os cupons funcionarem.

## 7. Testar uma compra
1. Com a chave de **teste** (sandbox), toque em **Seja Pro** no app, preencha nome e CPF e pague com Pix de teste.
2. No painel do sandbox, abra a cobrança criada e use **Confirmar recebimento** para simular o pagamento.
3. O selo do app muda para **⭐ PRO** em alguns segundos.
4. Funcionou? Troque `ASAAS_API_KEY` pela chave **real**, refaça o webhook na conta real e rode de novo o `deploy`.

Se a pessoa pedir estorno ou abrir contestação no cartão, o servidor retira os dias de Pro automaticamente.

## Onde mudar as coisas
| O quê | Onde |
|---|---|
| Preços dos planos | `functions/index.js` (PLANOS, o valor cobrado) e `pro.js` (PLANOS, o valor exibido) |
| Correções grátis e por dia | parâmetros `IA_GRATIS` e `IA_PRO_POR_DIA` no deploy |
| Modelo de IA | parâmetro `IA_MODEL` (padrão `claude-sonnet-5-5`) |
| Limites do plano grátis no app | `pro.js`, constante `FREE` |
| Questões do banco | `bank.js` |
