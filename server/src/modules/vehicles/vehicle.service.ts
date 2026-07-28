import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/errorHandler';
import { CreateVehicleInput, UpdateVehicleInput, SearchVehicleInput } from './vehicle.schema';

/**
 * Vehicle service.
 * Handles all vehicle-related business logic including CRUD and search operations.
 */
export class VehicleService {
  /**
   * Creates a new vehicle in the inventory.
   */
  async createVehicle(data: CreateVehicleInput) {
    const vehicle = await prisma.vehicle.create({
      data,
    });
    return vehicle;
  }

  /**
   * Retrieves all vehicles from the inventory.
   */
  async getAllVehicles() {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return vehicles;
  }

  /**
   * Retrieves a single vehicle by its ID.
   * @throws AppError if vehicle is not found.
   */
  async getVehicleById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found.', 404);
    }

    return vehicle;
  }

  /**
   * Searches vehicles by make, model, category, and/or price range.
   * All search criteria are optional and combined with AND logic.
   */
  async searchVehicles(query: SearchVehicleInput) {
    const where: any = {};

    if (query.make) {
      where.make = { contains: query.make, mode: 'insensitive' };
    }

    if (query.model) {
      where.model = { contains: query.model, mode: 'insensitive' };
    }

    if (query.category) {
      where.category = { contains: query.category, mode: 'insensitive' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return vehicles;
  }

  /**
   * Updates a vehicle's details.
   * @throws AppError if vehicle is not found.
   */
  async updateVehicle(id: string, data: UpdateVehicleInput) {
    // Verify vehicle exists
    await this.getVehicleById(id);

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    });

    return vehicle;
  }

  /**
   * Deletes a vehicle from the inventory.
   * @throws AppError if vehicle is not found.
   */
  async deleteVehicle(id: string) {
    // Verify vehicle exists
    await this.getVehicleById(id);

    await prisma.vehicle.delete({
      where: { id },
    });

    return { message: 'Vehicle deleted successfully.' };
  }
}

export const vehicleService = new VehicleService();
