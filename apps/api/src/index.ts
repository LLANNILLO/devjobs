import express from 'express';

const app = express();
const PORT = 3000;

app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => {
	console.info('API on :3000');
});
