import { Router } from "express";
import { loginController, refreshController, registerController } from "../controllers/auth.controller.js";

const router = Router();

router.get("/ping", async (_req, res) => {
  res.status(200).json({ message: "Pong!" });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - mode
 *             properties:
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               password:
 *                 type: string
 *               mode:
 *                 type: string
 *                 enum: [email, cpf]
 *           examples:
 *             loginWithEmail:
 *               summary: Login using email
 *               value:
 *                 email: user@email.com
 *                 password: StrongPassword123
 *                 mode: email
 *             loginWithCpf:
 *               summary: Login using CPF
 *               value:
 *                 cpf: "12345678901"
 *                 password: StrongPassword123
 *                 mode: cpf
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 400
 *                     error:
 *                       type: string
 *                       example: CLIENT_ERROR
 *                     code:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     message:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     fields:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             example: password
 *                           errorLabel:
 *                             type: string
 *                             example: Invalid input
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     path:
 *                       type: string
 *                       example: /login
 *       401:
 *         description: Unauthorized (invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 401
 *                     error:
 *                       type: string
 *                       example: CLIENT_ERROR
 *                     code:
 *                       type: string
 *                       example: UNAUTHORIZED
 *                     message:
 *                       type: string
 *                       example: Unauthorized
 *                     fields:
 *                       type: array
 *                       example: []
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     path:
 *                       type: string
 *                       example: /login
 */
router.post('/login', async (req, res) => {
    await loginController(req, res);
});

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - cpf
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               cpf:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     cpf:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     emailVerified:
 *                       type: boolean
 *                     phoneVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email, CPF or phone already registered
 */
router.post('/signUp', async (req, res) => {
    await registerController(req, res);
});


router.post('/refresh', async (req, res) => {
    await refreshController(req, res);
});

export default router;