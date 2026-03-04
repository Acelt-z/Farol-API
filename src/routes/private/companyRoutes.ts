import { Router } from "express";
import { createCompanyController, updateCompanyController } from "../../controllers/company.controller.js";
import { createBranchCompanyController } from "../../controllers/branch.controller.js";

const router = Router();

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
router.post('/', async (req, res) => {
    await createCompanyController(req, res);
});

/**
 * @swagger
 * /company/{companyId}:
 *   patch:
 *     summary: Update company basic information
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: At least one field must be provided
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Solutions Ltda ATUALIZADO"
 *               city:
 *                 type: string
 *                 example: "São Paulo ATUALIZADO"
 *               uf:
 *                 type: string
 *                 example: "RJ"
 *               street:
 *                 type: string
 *                 example: "Rua das Palmeiras ATUALIZADO"
 *               zipCode:
 *                 type: string
 *                 example: "01310930"
 *               number:
 *                 type: number
 *                 example: 8878
 *               complement:
 *                 type: string
 *                 nullable: true
 *                 example: "Sala 402 ATUALIZADO"
 *     responses:
 *       200:
 *         description: Company updated successfully
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
 *                     name:
 *                       type: string
 *                     cnpj:
 *                       type: string
 *                     city:
 *                       type: string
 *                     uf:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                     number:
 *                       type: number
 *                     complement:
 *                       type: string
 *                       nullable: true
 *                     totalWorkers:
 *                       type: number
 *                       example: 1
 *                     branches:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           cnpj:
 *                             type: string
 *                           city:
 *                             type: string
 *                           uf:
 *                             type: string
 *                           zipCode:
 *                             type: string
 *                           number:
 *                             type: number
 *                           complement:
 *                             type: string
 *                             nullable: true
 *                           totalWorkers:
 *                             type: number
 *                           status:
 *                             type: string
 *                           ownerId:
 *                             type: string
 *                             format: uuid
 *                           parentCompanyId:
 *                             type: string
 *                             format: uuid
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     trialEndsAt:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       example: TRIAL
 *                     ownerId:
 *                       type: string
 *                       format: uuid
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (e.g., branch company or invalid status)
 *       404:
 *         description: Company not found
 */
router.patch('/:companyId', async (req, res) => {
    await updateCompanyController(req, res);
});


/**
 * @swagger
 * /company/{parentCompanyId}/branch:
 *   post:
 *     summary: Create a new branch for a parent company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parentCompanyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the parent company
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
 *                 example: "Tech Solutions Ltda - Filial"
 *               cnpj:
 *                 type: string
 *                 example: "08999239000208"
 *                 description: Must be a valid branch CNPJ and share the same base number as the parent company
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
 *                 example: "Sala 502"
 *     responses:
 *       201:
 *         description: Branch created successfully
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
 *                       example: "Tech Solutions Ltda - Filial"
 *                     cnpj:
 *                       type: string
 *                       example: "08999239000208"
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
 *                       example: "Sala 502"
 *                     totalWorkers:
 *                       type: number
 *                       example: 0
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     ownerId:
 *                       type: string
 *                       format: uuid
 *                       example: "15617aef-0768-484c-9066-1bea96dc8cbc"
 *                     parentCompanyId:
 *                       type: string
 *                       format: uuid
 *                       example: "784062a9-bd88-42fb-9b76-84da519f9c30"
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
 *                       example: VALIDATION_ERROR
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
 *                           errorLabel:
 *                             type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     path:
 *                       type: string
 *                       example: /company/{parentCompanyId}/branch
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parent company not found
 */
router.post('/:parentCompanyId/branch', async (req, res) => {
    await createBranchCompanyController(req, res);
});

export default router;