import prisma from "../../utils/prisma";
import { RecommendationInput } from "./recommendation.schema";

export class RecommendationService {
  async getRecommendations(query: RecommendationInput) {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        quantity: {
          gt: 0,
        },
        ...(query.category
          ? {
              category: {
                equals: query.category,
                mode: "insensitive",
              },
            }
          : {}),
      },
    });

    const salesData = await prisma.purchase.groupBy({
      by: ["vehicleId"],
      _sum: {
        quantity: true,
      },
    });

    const salesMap = new Map(
      salesData.map((item) => [item.vehicleId, item._sum.quantity || 0]),
    );

    const maxSales = Math.max(
      ...salesData.map((item) => item._sum.quantity || 0),
      0,
    );

    const recommendations = vehicles.map((vehicle) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Category match
      if (
        query.category &&
        vehicle.category.toLowerCase() === query.category.toLowerCase()
      ) {
        score += 40;
        reasons.push("Matches your preferred category");
      }

      // 2. Budget match
      const withinBudget =
        (query.minPrice === undefined || vehicle.price >= query.minPrice) &&
        (query.maxPrice === undefined || vehicle.price <= query.maxPrice);

      if (withinBudget) {
        score += 40;
        reasons.push("Fits your budget");
      }

      // 3. Availability
      if (vehicle.quantity > 0) {
        score += 20;
        reasons.push("Currently available");
      }

      // 4. Historical demand
      const sales = salesMap.get(vehicle.id) || 0;

      if (sales > 0) {
        reasons.push(`Purchased ${sales} time${sales > 1 ? "s" : ""}`);
      }

      return {
        vehicle,
        score,
        sales,
        reasons,
      };
    });

    recommendations.sort((a, b) => b.score - a.score);

    return recommendations.slice(0, 5);
  }
}

export const recommendationService = new RecommendationService();
