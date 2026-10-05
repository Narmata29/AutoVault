"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const recommendation_controller_1 = require("./recommendation.controller");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (req, res, next) => {
    recommendation_controller_1.recommendationController.getRecommendations(req, res, next);
});
exports.default = router;
