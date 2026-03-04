import cors from 'cors';
import cookie from 'cookie-parser';
import express from "express";
import http from "http";
import logger from "./utils/logger.js";
import PublicRoutes from './routes/public.js';
import CompanyRoutes from './routes/private/companyRoutes.js';
import UserRoutes from './routes/private/userRoutes.js';
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "./middlewares/errorHandler.js";
import { config } from "dotenv";
import { getSwaggerDocument } from "./utils/swagger.js";
import { authMiddleware } from './middlewares/authMiddleware.js';

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

getSwaggerDocument()
  .then((swaggerDocument) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  })
  .catch((err) => {
    logger.error("Error on swagger files loading:", err);
  });

// Routes
app.use('/', PublicRoutes);
app.use('/me', authMiddleware, UserRoutes);
app.use('/company', authMiddleware, CompanyRoutes);


// Error middleware
app.use(errorHandler);


// Start server
server.listen(PORT, () => {
  logger.info(`Server running on PORT: ${PORT}`);
});
