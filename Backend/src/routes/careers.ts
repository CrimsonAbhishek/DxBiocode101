import { Router } from 'express';
import { createCareerApplication, getAllApplications, upload } from '../controllers/careerController';
const router = Router();
router.post('/', upload.single('resume'), createCareerApplication);
router.get('/', getAllApplications);
export default router;
