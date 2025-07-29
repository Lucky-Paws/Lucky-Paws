import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { chatValidation } from '../utils/validation';

const router = Router();

router.get('/rooms', authenticate, chatController.getRooms);
router.post('/rooms', authenticate, chatController.createRoom);
router.get('/rooms/:roomId/messages', authenticate, chatController.getMessages);
router.post('/rooms/:roomId/messages', authenticate, validate(chatValidation.sendMessage), chatController.sendMessage);

export default router;