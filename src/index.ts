import cors from 'cors';
import cookie from 'cookie-parser';
import express from "express";
import http from "http";
import logger from "./utils/logger.js";
import PublicRoutes from './routes/public.js';
import PrivateRoutes from './routes/public.js';
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "./middlewares/errorHandler.js";
import { config } from "dotenv";
import { swaggerSpec } from "./utils/swagger.js";
import { authMiddleware } from './middlewares/authMidlleware.js';

config();

const PORT = process.env.PORT ?? 3000;

// Server
const app = express();
const server = http.createServer(app);

app.use(express.json())

// Cors & Cookies
app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
}));

app.use(cookie());


// Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/', PublicRoutes);
app.use('/', authMiddleware, PrivateRoutes);


// Error middleware
app.use(errorHandler);
// Initialize server
server.listen(PORT, () => {
  logger.info(`Server running on PORT: ${PORT}`);
});
