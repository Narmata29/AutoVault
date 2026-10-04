"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
/**
 * Database seed script.
 * Creates a default admin user and sample vehicles for development.
 */
async function main() {
    console.log('🌱 Seeding database...');
    // Create admin user
    const adminPassword = await bcryptjs_1.default.hash('Admin123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@cardealership.com' },
        update: {},
        create: {
            email: 'admin@cardealership.com',
            password: adminPassword,
            name: 'Admin User',
            role: client_1.Role.ADMIN,
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
    // Create sample vehicles
    const vehicles = [
        {
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 28000,
            quantity: 5,
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
        },
        {
            make: 'Honda',
            model: 'CR-V',
            category: 'SUV',
            price: 35000,
            quantity: 3,
            imageUrl: 'https://images.unsplash.com/photo-1568844293986-8d0400f4f36a?w=400',
        },
        {
            make: 'Ford',
            model: 'Mustang',
            category: 'Sports',
            price: 45000,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=400',
        },
        {
            make: 'Tesla',
            model: 'Model 3',
            category: 'Electric',
            price: 42000,
            quantity: 4,
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
        },
        {
            make: 'BMW',
            model: 'X5',
            category: 'SUV',
            price: 62000,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
        },
        {
            make: 'Mercedes-Benz',
            model: 'C-Class',
            category: 'Luxury',
            price: 55000,
            quantity: 3,
            imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
        },
        {
            make: 'Chevrolet',
            model: 'Silverado',
            category: 'Truck',
            price: 38000,
            quantity: 6,
            imageUrl: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400',
        },
        {
            make: 'Audi',
            model: 'A4',
            category: 'Sedan',
            price: 48000,
            quantity: 0,
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        },
    ];
    for (const vehicle of vehicles) {
        await prisma.vehicle.create({ data: vehicle });
    }
    console.log(`✅ ${vehicles.length} sample vehicles created`);
    console.log('🌱 Seeding complete!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map