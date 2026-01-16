import { Router } from 'express';
import { boardController } from '@/controllers/board.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/workspace/:workspaceId', boardController.getBoardsByWorkspace);

router.get('/:id', boardController.getBoardById);
router.post('/', boardController.createBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

export default router;
