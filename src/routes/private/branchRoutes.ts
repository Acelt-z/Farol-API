import { Router } from "express";

const router = Router();

router.patch('/:branchId', async (_req, _res) => {
    // TODO: Update register infos
});

router.patch('/:branchId/status', async (_req, _res) => {
    // TODO: Update status (ACTIVE/SUSPENDED)
});

router.delete('/:branchId', async (_req, _res) => {
    // TODO: Delete branch
});

export default router;