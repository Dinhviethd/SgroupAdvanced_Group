import { Router } from 'express';
import { cardController } from '@/controllers/card.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/list/:listId', cardController.getCardsByList);

router.get('/board/:boardId', cardController.getCardsByBoard);

router.get('/:id', cardController.getCardById);
router.post('/', cardController.createCard);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

router.post('/:id/move', cardController.moveCard);

router.post('/:id/archive', cardController.archiveCard);
router.post('/:id/unarchive', cardController.unarchiveCard);

export default router;
