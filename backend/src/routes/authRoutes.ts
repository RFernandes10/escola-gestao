import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();
const service = new AuthService();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const result = await service.register({ email, password, name, role });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await service.getById(req.userId!);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export { router as authRoutes };