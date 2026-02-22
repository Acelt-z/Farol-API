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
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
 await loginController(req, res);
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user account and returns an access token.
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
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@email.com
 *               cpf:
 *                 type: string
 *                 example: 12345678901
 *               phone:
 *                 type: string
 *                 example: 11999999999
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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