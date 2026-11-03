export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'POST' && url.pathname === `/webhook/${env.WEBHOOK_SECRET}`) {
      const update = await req.json();
      if (update.message) {
        const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: update.message.chat.id,
            text: 'Считаю стоимость 3D-печати. Нажми кнопку ниже.',
            reply_markup: { inline_keyboard: [[{ text: 'Открыть калькулятор', web_app: { url: env.WEBAPP_URL } }]] },
          }),
        });
        console.log('Telegram:', r.status, await r.text());
      }
      return new Response('ok');
    }
    return new Response('Not found', { status: 404 });
  },
};
