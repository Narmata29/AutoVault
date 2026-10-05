"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationController = exports.RecommendationController = void 0;
const recommendation_service_1 = require("./recommendation.service");
const recommendation_schema_1 = require("./recommendation.schema");
class RecommendationController {
    async getRecommendations(req, res, next) {
        try {
            const query = recommendation_schema_1.recommendationSchema.parse(req.query);
            const recommendations = await recommendation_service_1.recommendationService.getRecommendations(query);
            res.status(200).json({
                recommendations,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RecommendationController = RecommendationController;
exports.recommendationController = new RecommendationController();
