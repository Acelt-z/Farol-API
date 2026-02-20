import http from "http";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv";

import { swaggerSpec } from "./utils/swagger.js";
import logger from "./utils/logger.js";

// Inicializa o DotEnv
config();

const PORT = process.env.PORT ?? 3000; // Porta do serviço

// Servidor e aplicação
const app = express();
const server = http.createServer(app);

// Rota de testes
app.get("/ping", (_req, res) => {
  res.status(200).json({ message: "Pong!" });
});

// Rota de documentação
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Inicializa o servidor
server.listen(PORT, () => {
  logger.info(`Server running on PORT: ${PORT}`);
});
