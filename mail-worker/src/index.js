// RitiMail — API própria de email temporário (Cloudflare Worker + D1 + Email Routing)
// Troque os domínios abaixo pelos domínios que você registrou e adicionou
// no Cloudflare (Email Routing precisa estar ativo em cada um deles).
const DOMAINS = ['brightgeta.com', 'fusioninbox.com', 'skola.edu.com'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function randomUser() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = chars[Math.floor(Math.random() * 26)]; // start with a letter
  for (let i = 0; i < 9; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function getAddressByToken(db, token) {
  return db.prepare('SELECT * FROM addresses WHERE token = ?').bind(token).first();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    try {
      // GET /api/domains — lista de domínios disponíveis
      if (pathname === '/api/domains' && request.method === 'GET') {
        return json({ domains: DOMAINS });
      }

      // POST /api/generate — cria um novo endereço temporário
      if (pathname === '/api/generate' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const domain = DOMAINS.includes(body.domain) ? body.domain : DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
        const address = `${randomUser()}@${domain}`;
        const token = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO addresses (address, token, created_at) VALUES (?,?,?)')
          .bind(address, token, Date.now()).run();
        return json({ address, token, domain });
      }

      // GET /api/messages?token=... — lista mensagens do endereço
      if (pathname === '/api/messages' && request.method === 'GET') {
        const token = url.searchParams.get('token');
        const addr = await getAddressByToken(env.DB, token);
        if (!addr) return json({ error: 'Endereço não encontrado' }, 404);
        const { results } = await env.DB.prepare(
          'SELECT id, from_addr, subject, text_body, created_at, seen FROM messages WHERE address = ? ORDER BY created_at DESC'
        ).bind(addr.address).all();
        return json({ messages: results || [] });
      }

      // GET /api/message?token=...&id=... — mensagem completa
      if (pathname === '/api/message' && request.method === 'GET') {
        const token = url.searchParams.get('token');
        const id = url.searchParams.get('id');
        const addr = await getAddressByToken(env.DB, token);
        if (!addr) return json({ error: 'Endereço não encontrado' }, 404);
        const msg = await env.DB.prepare('SELECT * FROM messages WHERE id = ? AND address = ?').bind(id, addr.address).first();
        if (!msg) return json({ error: 'Mensagem não encontrada' }, 404);
        await env.DB.prepare('UPDATE messages SET seen = 1 WHERE id = ?').bind(id).run();
        return json({ message: msg });
      }

      // DELETE /api/address?token=... — apaga o endereço e suas mensagens
      if (pathname === '/api/address' && request.method === 'DELETE') {
        const token = url.searchParams.get('token');
        const addr = await getAddressByToken(env.DB, token);
        if (!addr) return json({ error: 'Endereço não encontrado' }, 404);
        await env.DB.prepare('DELETE FROM messages WHERE address = ?').bind(addr.address).run();
        await env.DB.prepare('DELETE FROM addresses WHERE address = ?').bind(addr.address).run();
        return json({ ok: true });
      }

      return json({ error: 'Rota não encontrada' }, 404);
    } catch (err) {
      return json({ error: err.message || 'Erro interno' }, 500);
    }
  },

  // Disparado pelo Cloudflare Email Routing (catch-all) em cada domínio configurado
  async email(message, env) {
    const to = message.to.toLowerCase();

    const addr = await env.DB.prepare('SELECT address FROM addresses WHERE address = ?').bind(to).first();
    if (!addr) {
      message.setReject('Endereço não existe ou expirou');
      return;
    }

    let subject = message.headers.get('subject') || '(Sem assunto)';
    let text = '', html = '';

    try {
      const { default: PostalMime } = await import('postal-mime');
      const parser = new PostalMime();
      const raw = await new Response(message.raw).arrayBuffer();
      const email = await parser.parse(raw);
      subject = email.subject || subject;
      text = email.text || '';
      html = email.html || '';
    } catch (e) {
      // fallback simples caso o parser falhe
      text = 'Não foi possível processar o corpo do email.';
    }

    await env.DB.prepare(
      'INSERT INTO messages (id, address, from_addr, subject, text_body, html_body, created_at, seen) VALUES (?,?,?,?,?,?,?,0)'
    ).bind(crypto.randomUUID(), to, message.from, subject, text, html, Date.now()).run();
  },
};
