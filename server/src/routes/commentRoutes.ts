import { Router } from 'express';
import { commentController } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { commentValidation } from '../utils/validation';

const router = Router({ mergeParams: true });

router.get('/', commentController.getComments);
router.post('/', authenticate, validate(commentValidation.create), commentController.createComment);
router.patch('/:commentId', authenticate, validate(commentValidation.update), commentController.updateComment);
router.delete('/:commentId', authenticate, commentController.deleteComment);
router.post('/:commentId/like', authenticate, commentController.likeComment);

export default router;