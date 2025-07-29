import { Router } from 'express';
import { postController } from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validation';
import { postValidation } from '../utils/validation';

const router = Router();

router.get('/', validateQuery(postValidation.query), postController.getPosts);
router.get('/search', postController.searchPosts);
router.get('/:id', postController.getPost);
router.post('/', authenticate, validate(postValidation.create), postController.createPost);
router.patch('/:id', authenticate, validate(postValidation.update), postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/like', authenticate, postController.likePost);
router.delete('/:id/unlike', authenticate, postController.unlikePost);

export default router;