# Como ativar o ENEM Turbo Pro

O app já está no ar. Este passo a passo liga as três partes que precisam do servidor:
a correção de redação com IA, o pagamento pelo Mercado Pago e a liberação do Pro.
Faça uma vez só. Leva cerca de 30 minutos.

## 1. Plano Blaze no Firebase
O Firebase só roda funções de servidor no plano Blaze (pago por uso, com cota grátis mensal).

1. Abra o console do Firebase e entre no projeto **enem-turbo**.
2. No canto inferior esquerdo, clique em **Fazer upgrade** e escolha **Blaze**.
3. Crie um **alerta de orçamento** (por exemplo, R$ 50) para ser avisada se o gasto subir.

## 2. Chave da IA (Claude)
1. Entre em **console.anthropic.com**, crie a conta e adicione créditos em **Billing**.
2. Em **API Keys**, clique em **Create Key** e copie a chave (começa com `sk-ant-`).
3. Os preços por uso ficam em **docs.claude.com** (página de preços). Cada correção usa uma chamada.

## 3. Credenciais do Mercado Pago
1. Entre em **mercadopago.com.br/developers**, vá em **Suas integrações** e crie uma aplicação (Checkout Pro).
2. Para testar primeiro, use as **credenciais de teste**. Para vender de verdade, use as **credenciais de produção**.
3. Copie o **Access Token** (começa com `APP_USR-` em produção ou `TEST-` em teste).

## 4. Publicar o servidor (pelo navegador, sem instalar nada)
1. Abra **shell.cloud.google.com** com a mesma conta Google do Firebase.
2. Cole estes comandos, um de cada vez:

```bash
git clone https://github.com/jmarcicofast-cell/enem-turbo
cd enem-turbo/functions && npm install && cd ..
npx firebase-tools login --no-localhost
npx firebase-tools functions:secrets:set ANTHROPIC_API_KEY
npx firebase-tools functions:secrets:set MP_ACCESS_TOKEN
npx firebase-tools deploy --only functions,firestore:rules
```

- No `login`, abra o link que aparece, autorize e cole o código de volta.
- Em cada `secrets:set`, cole a chave correspondente e aperte Enter.
- No `deploy`, quando perguntar **ADMIN_EMAILS**, digite o seu e-mail de login no app.
  Nas outras perguntas, só aperte Enter para usar o valor padrão.

## 5. Liberar o Pro para as suas irmãs
1. Elas criam a conta no app normalmente.
2. Você entra no app com o seu e-mail e abre **jmarcicofast-cell.github.io/enem-turbo/admin.html**.
3. Digite o e-mail de cada uma e quantos dias de Pro quer dar.

## 6. Testar uma compra
1. Com as credenciais de **teste** do Mercado Pago, toque em **Seja Pro** no app e pague com um cartão de teste.
2. O app volta sozinho e o selo muda para **⭐ PRO** em alguns segundos.
3. Funcionou? Troque o `MP_ACCESS_TOKEN` pelo de **produção** (repita o `secrets:set` e o `deploy`).

## Onde mudar as coisas
| O quê | Onde |
|---|---|
| Preços dos planos | `functions/index.js` (PLANOS, o valor cobrado) e `pro.js` (PLANOS, o valor exibido) |
| Correções grátis e por dia | parâmetros `IA_GRATIS` e `IA_PRO_POR_DIA` no deploy |
| Modelo de IA | parâmetro `IA_MODEL` (padrão `claude-sonnet-5-5`) |
| Limites do plano grátis no app | `pro.js`, constante `FREE` |
| Questões do banco | `bank.js` |
