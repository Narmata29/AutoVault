import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/errorHandler';

/**
 * Inventory service.
 * Handles purchase and restock operations that modify vehicle quantities.
 */
export class InventoryService {
  /**
   * Purchases a vehicle, decreasing its quantity by 1.
   * @throws AppError if vehicle not found or out of stock.
   */
  async purchaseVehicle(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found.', 404);
    }

    if (vehicle.quantity <= 0) {
      throw new AppError('Vehicle is out of stock.', 400);
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { quantity: vehicle.quantity - 1 },
    });

    return {
      message: `Successfully purchased ${vehicle.make} ${vehicle.model}.`,
      vehicle: updated,
    };
  }

  /**
   * Restocks a vehicle, increasing its quantity by the specified amount.
   * @throws AppError if vehicle not found.
   */
  async restockVehicle(vehicleId: string, quantity: number) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found.', 404);
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { quantity: vehicle.quantity + quantity },
    });

    return {
      message: `Successfully restocked ${quantity} units of ${vehicle.make} ${vehicle.model}.`,
      vehicle: updated,
    };
  }
}

export const inventoryService = new InventoryService();
