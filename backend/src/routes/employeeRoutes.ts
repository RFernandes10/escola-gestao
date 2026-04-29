import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();
const ctrl = new EmployeeController();

router.use(authMiddleware);

router.get('/', ctrl.list.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));

router.post('/', requireRole('DIRECTOR'), upload.single('photo'), ctrl.create.bind(ctrl));
router.put('/:id', requireRole('DIRECTOR'), upload.single('photo'), ctrl.update.bind(ctrl));
router.patch('/:id/status', requireRole('DIRECTOR'), ctrl.toggleStatus.bind(ctrl));
router.delete('/:id', requireRole('DIRECTOR'), ctrl.delete.bind(ctrl));

export { router as employeeRoutes };