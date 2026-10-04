import { Request, Response, NextFunction } from 'express';
import { recommendationService } from './recommendation.service';
import { recommendationSchema } from './recommendation.schema';

export class RecommendationController {
  async getRecommendations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = recommendationSchema.parse(req.query);

      const recommendations =
        await recommendationService.getRecommendations(query);

      res.status(200).json({
        recommendations,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const recommendationController =
  new RecommendationController();