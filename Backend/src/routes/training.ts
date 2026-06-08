import { Router } from 'express';
import { createTraining, getAllTraining } from '../controllers/trainingController';
const router = Router();
router.post('/', createTraining);
router.get('/', getAllTraining);
export default router;
