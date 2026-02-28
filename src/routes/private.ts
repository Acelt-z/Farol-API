import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller.js";
import { createCompanyController, getUserCompaniesCards, getUserCompaniesController } from "../controllers/company.controller.js";

const router = Router();


/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', async (req, res) => {
    await getCurrentUserController(req, res);
});

/**
 * @swagger
 * /me/companies:
 *   get:
 *     summary: Get all companies of the authenticated user
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "784062a9-bd88-42fb-9b76-84da519f9c30"
 *                       name:
 *                         type: string
 *                         example: "My Company"
 *                       cnpj:
 *                         type: string
 *                         example: "12345678000199"
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       uf:
 *                         type: string
 *                       zipCode:
 *                         type: string
 *                       number:
 *                         type: string
 *                       complement:
 *                         type: string
 *                         nullable: true
 *                       status:
 *                         type: string
 *                         example: TRIAL
 *                       plan:
 *                         type: string
 *                         example: BASIC
 *                       trialEndsAt:
 *                         type: string
 *                         format: date-time
 *                       totalWorkers:
 *                         type: number
 *                         example: 1
 *                       userRole:
 *                         type: string
 *                         example: OWNER
 *       401:
 *         description: Unauthorized
 */
router.get('/me/companies', async (req, res) => {
    await getUserCompaniesController(req, res);
});

/**
 * @swagger
 * /company:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cnpj
 *               - street
 *               - city
 *               - uf
 *               - zipCode
 *               - number
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Solutions Ltda"
 *               cnpj:
 *                 type: string
 *                 example: "08999239000129"
 *               street:
 *                 type: string
 *                 example: "Av. Paulista"
 *               city:
 *                 type: string
 *                 example: "São Paulo"
 *               uf:
 *                 type: string
 *                 example: "SP"
 *               zipCode:
 *                 type: string
 *                 example: "01310930"
 *               number:
 *                 type: number
 *                 example: 150
 *               complement:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Company created successfully
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
 *                       format: uuid
 *                       example: "84a2ad5a-48cc-4a6d-a912-709f3d215db1"
 *                     name:
 *                       type: string
 *                       example: "Tech Solutions Ltda"
 *                     cnpj:
 *                       type: string
 *                       example: "08999239000129"
 *                     city:
 *                       type: string
 *                       example: "São Paulo"
 *                     uf:
 *                       type: string
 *                       example: "SP"
 *                     zipCode:
 *                       type: string
 *                       example: "01310930"
 *                     number:
 *                       type: number
 *                       example: 150
 *                     complement:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     totalWorkers:
 *                       type: number
 *                       example: 1
 *                     trialEndsAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-03-05T19:03:34.476Z"
 *                     status:
 *                       type: string
 *                       example: TRIAL 
 *                     ownerId:
 *                       type: string
 *                       format: uuid
 *                       example: "15617aef-0768-484c-9066-1bea96dc8cbc"
 *                     planId:
 *                       type: number
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
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
 *                             example: cnpj
 *                           errorLabel:
 *                             type: string
 *                             example: CNPJ already registered
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     path:
 *                       type: string
 *                       example: /company
 *       401:
 *         description: Unauthorized
 */
router.post('/company', async (req, res) => {
    await createCompanyController(req, res);
});


/**
 * @swagger
 * /me/companies/cards:
 *   get:
 *     summary: Get company cards of the authenticated user
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of company cards associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "e15f24dd-8b4c-44c3-8b38-ba1d090e71ab"
 *                       name:
 *                         type: string
 *                         example: "Tech Solutions Ltda"
 *                       cnpj:
 *                         type: string
 *                         example: "19131243000197"
 *                       city:
 *                         type: string
 *                         example: "São Paulo"
 *                       uf:
 *                         type: string
 *                         example: "SP"
 *                       totalWorkers:
 *                         type: number
 *                         example: 1
 *                       trialEndsAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-04T20:47:12.977Z"
 *                       ownerId:
 *                         type: string
 *                         format: uuid
 *                         example: "15617aef-0768-484c-9066-1bea96dc8cbc"
 *                       planId:
 *                         type: number
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "TRIAL"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/me/companies/cards', async (req, res) => {
    await getUserCompaniesCards(req, res);
});


export default router;