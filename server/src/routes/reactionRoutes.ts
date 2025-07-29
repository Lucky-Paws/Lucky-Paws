import { Router } from 'express';
import { reactionController } from '../controllers/reactionController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { reactionValidation } from '../utils/validation';

const router = Router({ mergeParams: true });

router.post('/', authenticate, validate(reactionValidation.add), reactionController.addReaction);
router.delete('/:reactionId', authenticate, reactionController.removeReaction);

export default router;