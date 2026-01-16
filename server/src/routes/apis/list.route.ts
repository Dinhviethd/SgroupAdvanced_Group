import { Router } from 'express';
import { listController } from '@/controllers/list.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/board/:boardId', listController.getListsByBoard);

router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.delete('/:id', listController.deleteList);

router.post('/:id/archive', listController.archiveList);

export default router;
