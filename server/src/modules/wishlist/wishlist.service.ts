import prisma from "../../utils/prisma";

export class WishlistService {
  async addToWishlist(userId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_vehicleId: {
          userId,
          vehicleId,
        },
      },
    });

    if (existingWishlist) {
      throw new Error("Vehicle already in wishlist");
    }

    return prisma.wishlist.create({
      data: {
        userId,
        vehicleId,
      },
      include: {
        vehicle: true,
      },
    });
  }

  async removeFromWishlist(userId: string, vehicleId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId_vehicleId: {
          userId,
          vehicleId,
        },
      },
    });

    if (!wishlist) {
      throw new Error("Vehicle not found in wishlist");
    }

    await prisma.wishlist.delete({
      where: {
        userId_vehicleId: {
          userId,
          vehicleId,
        },
      },
    });

    return {
      message: "Vehicle removed from wishlist",
    };
  }

  async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const wishlistService = new WishlistService();