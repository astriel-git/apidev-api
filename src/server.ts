import { app } from './app.ts';
import 'dotenv/config';
// At the very top of src/server.ts or test-token.ts
process.env.TZ = 'UTC';
import 'dotenv/config';
console.log("Current Time (UTC):", new Date().toISOString());
console.log("TZ:", process.env.TZ);



console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);


const PORT = process.env.PORT ? Number(process.env.PORT) : 4080;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
