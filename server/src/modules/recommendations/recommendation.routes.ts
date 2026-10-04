import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { recommendationController } from './recommendation.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  (req, res, next) => {
    recommendationController.getRecommendations(req, res, next);
  }
);

export default router;