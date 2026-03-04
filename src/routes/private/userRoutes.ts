import { Router } from "express";
import { getUserCompaniesCards, getUserCompaniesController } from "../../controllers/company.controller.js";
import { getCurrentUserController } from "../../controllers/user.controller.js";

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
router.get('/', async (req, res) => {
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
 *                         example: "d4c83365-299c-47d1-82a3-b78f15afca92"
 *                       name:
 *                         type: string
 *                         example: "Tech Solutions Ltda"
 *                       cnpj:
 *                         type: string
 *                         example: "45988264000133"
 *                       city:
 *                         type: string
 *                         example: "São Paulo"
 *                       uf:
 *                         type: string
 *                         example: "SP"
 *                       zipCode:
 *                         type: string
 *                         example: "01310930"
 *                       number:
 *                         type: string
 *                         example: 150
 *                       complement:
 *                         type: string
 *                         nullable: true
 *                       totalWorkers:
 *                         type: number
 *                         example: 1
 *                       branches:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *                             cnpj:
 *                               type: string
 *                             city:
 *                               type: string
 *                             uf:
 *                               type: string
 *                             zipCode:
 *                               type: string
 *                             number:
 *                               type: string
 *                             complement:
 *                               type: string
 *                               nullable: true
 *                             totalWorkers:
 *                               type: number
 *                               example: 0
 *                             status:
 *                               type: string
 *                               example: ACTIVE
 *                             ownerId:
 *                               type: string
 *                               format: uuid
 *                             parentCompanyId:
 *                               type: string
 *                               format: uuid
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                       trialEndsAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-08T19:44:32.139Z"
 *                       status:
 *                         type: string
 *                         example: TRIAL
 *                       ownerId:
 *                         type: string
 *                         format: uuid
 *                         example: "15617aef-0768-484c-9066-1bea96dc8cbc"
 *                       planId:
 *                         type: number
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/companies', async (req, res) => {
    await getUserCompaniesController(req, res);
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
router.get('/companies/cards', async (req, res) => {
    await getUserCompaniesCards(req, res);
});


export default router;