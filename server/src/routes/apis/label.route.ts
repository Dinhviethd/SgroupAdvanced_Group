import { Router } from 'express';
import { labelController } from '@/controllers/label.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/board/:boardId', labelController.getLabelsByBoard);

router.post('/', labelController.createLabel);
router.put('/:id', labelController.updateLabel);
router.delete('/:id', labelController.deleteLabel);

router.post('/card/:cardId', labelController.addLabelToCard);
router.delete('/card/:cardId/:labelId', labelController.removeLabelFromCard);

export default router;
