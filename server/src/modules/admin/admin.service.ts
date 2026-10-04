import prisma from '../../utils/prisma';

export class AdminService {

  async getAnalytics() {

    // Total vehicle records
    const totalVehicles = await prisma.vehicle.count();

    // Total units currently in stock
    const stockResult = await prisma.vehicle.aggregate({
      _sum: {
        quantity: true,
      },
    });

    const totalStock = stockResult._sum.quantity || 0;

    // Total purchases and revenue
    const purchaseStats = await prisma.purchase.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        quantity: true,
        totalAmount: true,
      },
    });

    const totalSales = purchaseStats._sum.quantity || 0;
    const totalOrders = purchaseStats._count.id;
    const totalRevenue = purchaseStats._sum.totalAmount || 0;

    // Calculate current inventory value
    const vehicles = await prisma.vehicle.findMany({
      select: {
        price: true,
        quantity: true,
      },
    });

    const inventoryValue = vehicles.reduce(
      (total, vehicle) =>
        total + vehicle.price * vehicle.quantity,
      0
    );

    // Low stock vehicles
    // Threshold: 2 or fewer units
    const lowStockVehicles = await prisma.vehicle.count({
      where: {
        quantity: {
          lte: 2,
        },
      },
    });

    // Sales grouped by vehicle category
    const purchases = await prisma.purchase.findMany({
      select: {
        quantity: true,
        totalAmount: true,
        vehicle: {
          select: {
            category: true,
          },
        },
      },
    });

    const categoryMap: Record<
      string,
      { sales: number; revenue: number }
    > = {};

    purchases.forEach((purchase) => {
      const category = purchase.vehicle.category;

      if (!categoryMap[category]) {
        categoryMap[category] = {
          sales: 0,
          revenue: 0,
        };
      }

      categoryMap[category].sales += purchase.quantity;
      categoryMap[category].revenue += purchase.totalAmount;
    });

    const salesByCategory = Object.entries(categoryMap).map(
      ([category, data]) => ({
        category,
        sales: data.sales,
        revenue: data.revenue,
      })
    );

    // Recent purchases
    const recentPurchases = await prisma.purchase.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        quantity: true,
        totalAmount: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
            category: true,
          },
        },
      },
    });

    return {
      totalVehicles,
      totalStock,
      totalOrders,
      totalSales,
      totalRevenue,
      inventoryValue,
      lowStockVehicles,
      salesByCategory,
      recentPurchases,
    };
  }

  // ==========================================
  // Inventory Demand Insights
  // ==========================================

  async getDemandInsights() {

    const vehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        make: true,
        model: true,
        category: true,
        price: true,
        quantity: true,
        imageUrl: true,
      },
    });

    const salesData = await prisma.purchase.groupBy({
      by: ['vehicleId'],
      _sum: {
        quantity: true,
      },
    });

    const salesMap = new Map(
      salesData.map((item) => [
        item.vehicleId,
        item._sum.quantity || 0,
      ])
    );

    const insights = vehicles.map((vehicle) => {

      const sales = salesMap.get(vehicle.id) || 0;

      let demand: 'High' | 'Medium' | 'Low';

      if (sales >= 5) {
        demand = 'High';
      } else if (sales >= 2) {
        demand = 'Medium';
      } else {
        demand = 'Low';
      }

      const restockRecommended =
        vehicle.quantity <= 2 && sales > 0;

      return {
        vehicle,
        sales,
        demand,
        restockRecommended,
      };
    });

    insights.sort((a, b) => b.sales - a.sales);

    return insights;
  }
}

export const adminService = new AdminService();