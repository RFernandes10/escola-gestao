import { Router, Response } from 'express';
import { AIService } from '../services/aiService';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const aiService = new AIService();

router.use(authMiddleware);
router.use(requireRole('DIRECTOR'));

router.get('/summarize', async (req: AuthRequest, res: Response) => {
  try {
    const summary = await aiService.summarizeEmployees();
    res.json({ summary });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Erro ao gerar resumo' });
  }
});

router.get('/analyze', async (req: AuthRequest, res: Response) => {
  try {
    const analysis = await aiService.analyzeData();
    res.json({ analysis });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Erro ao analisar dados' });
  }
});

router.get('/report', async (req: AuthRequest, res: Response) => {
  try {
    const report = await aiService.generateReport();
    res.json({ report });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Erro ao gerar relatório' });
  }
});

export { router as aiRoutes };