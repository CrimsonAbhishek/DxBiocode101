import { Router } from 'express';
import { createQuote, getAllQuotes } from '../controllers/quoteController';
const router = Router();
router.post('/', createQuote);
router.get('/', getAllQuotes);
export default router;
