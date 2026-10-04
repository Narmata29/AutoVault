import prisma from '../../utils/prisma';

export class PurchaseService {

  async getMyPurchases(userId: string) {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            category: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return purchases;
  }
}

export const purchaseService = new PurchaseService();