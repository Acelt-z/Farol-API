import http from "http";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv";
import cors from 'cors';
import cookie from 'cookie-parser';

import { swaggerSpec } from "./utils/swagger.js";
import logger from "./utils/logger.js";
import PublicRoutes from './routes/public.js';

config();

const PORT = process.env.PORT ?? 3000;

// Server
const app = express();
const server = http.createServer(app);

// Cors & Cookies
app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
}));
app.use(cookie());


// Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', PublicRoutes)

// Initialize server
server.listen(PORT, () => {
  logger.info(`Server running on PORT: ${PORT}`);
});
