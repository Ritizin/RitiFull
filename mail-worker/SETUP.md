# RitiMail — API própria de Email Temporário

Isso substitui o mail.tm por uma API 100% sua, rodando em Cloudflare Workers,
usando domínios que você registra. Sem depender de serviço de terceiros.

## Por que precisa disso
Um site estático (GitHub Pages) não consegue *receber* email — isso exige um
servidor de email (registros MX) rodando 24/7. O Cloudflare Email Routing +
Workers resolve isso de graça, sem precisar manter servidor.

## Passo a passo

### 1. Registre os domínios
Compre `brightgeta.com`, `fusioninbox.com` e `skola.edu.com` (ou os domínios
que preferir) em qualquer registrador (Registro.br, Namecheap, etc).

### 2. Adicione os domínios ao Cloudflare
No dashboard da Cloudflare → "Add a Site" → cole cada domínio → siga o passo
de trocar os nameservers no registrador.

### 3. Ative o Email Routing em cada domínio
Dashboard do domínio → **Email → Email Routing** → Enable.
A Cloudflare configura os registros MX automaticamente.

### 4. Instale o Wrangler e faça login
```bash
npm install -g wrangler
wrangler login
```

### 5. Crie o banco D1
```bash
cd mail-worker
wrangler d1 create ritimail
```
Copie o `database_id` retornado e cole em `wrangler.toml` no lugar de
`COLE_AQUI_O_ID_DO_BANCO`.

### 6. Rode o schema
```bash
wrangler d1 execute ritimail --remote --file=./schema.sql
```

### 7. Deploy do Worker
```bash
wrangler deploy
```
Isso te dá uma URL tipo `https://ritimail.SEU-USUARIO.workers.dev`.

### 8. Conecte o catch-all de cada domínio ao Worker
Dashboard → domínio → Email → Email Routing → **Routing rules** →
Catch-all address → **Action: Send to a Worker** → selecione `ritimail`.
Repita para os 3 domínios.

### 9. Configure o frontend
Abra `email/index.html` e edite a linha:
```js
const MAIL_API_BASE = ''; // <- coloque aqui a URL do seu worker
```
Coloque a URL do passo 7, por exemplo:
```js
const MAIL_API_BASE = 'https://ritimail.seu-usuario.workers.dev';
```

Pronto — os emails gerados em `@brightgeta.com`, `@fusioninbox.com` e
`@skola.edu.com` agora funcionam de verdade, com uma API que é 100% sua.

## Testando localmente
```bash
wrangler dev --remote
```
(precisa de `--remote` porque Email Routing não funciona 100% offline)
