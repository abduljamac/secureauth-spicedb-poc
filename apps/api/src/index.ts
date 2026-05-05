import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
