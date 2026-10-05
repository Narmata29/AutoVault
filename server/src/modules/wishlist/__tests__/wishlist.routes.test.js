"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const prisma_1 = __importDefault(require("../../../utils/prisma"));
let userToken;
let adminToken;
beforeAll(async () => {
    // Create test user
    const userRes = await (0, supertest_1.default)(app_1.default)
        .post("/api/auth/register")
        .send({
        email: "wishlistuser@test.com",
        password: "password123",
        name: "Wishlist User",
    });
    userToken = userRes.body.token;
    // Create test admin
    const adminRes = await (0, supertest_1.default)(app_1.default)
        .post("/api/auth/register")
        .send({
        email: "wishlistadmin@test.com",
        password: "password123",
        name: "Wishlist Admin",
        adminSecret: process.env.ADMIN_SECRET,
    });
    adminToken = adminRes.body.token;
});
// Clean up test data after each test
afterEach(async () => {
    await prisma_1.default.wishlist.deleteMany({
        where: {
            user: {
                email: { contains: "@test.com" },
            },
        },
    });
    await prisma_1.default.vehicle.deleteMany({
        where: {
            make: { contains: "WishlistTest" },
        },
    });
});
// Disconnect Prisma
afterAll(async () => {
    await prisma_1.default.wishlist.deleteMany({
        where: {
            user: {
                email: { contains: "@test.com" },
            },
        },
    });
    await prisma_1.default.user.deleteMany({
        where: {
            email: { contains: "@test.com" },
        },
    });
    await prisma_1.default.$disconnect();
});
describe("Wishlist Routes", () => {
    describe("GET /api/wishlist", () => {
        it("should return wishlist for authenticated user", async () => {
            // Admin creates a test vehicle
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                make: "WishlistTestCar",
                model: "ModelX",
                category: "SUV",
                price: 40000,
                quantity: 3,
            });
            const vehicleId = createRes.body.vehicle.id;
            // Add vehicle to wishlist
            await (0, supertest_1.default)(app_1.default)
                .post("/api/wishlist")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                vehicleId,
            });
            // Get wishlist
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/wishlist")
                .set("Authorization", `Bearer ${userToken}`);
            expect(res.status).toBe(200);
            expect(res.body.wishlist).toBeDefined();
            expect(Array.isArray(res.body.wishlist)).toBe(true);
            expect(res.body.wishlist.length).toBe(1);
            const wishlistItem = res.body.wishlist[0];
            expect(wishlistItem.vehicleId).toBe(vehicleId);
            expect(wishlistItem.vehicle).toBeDefined();
            expect(wishlistItem.vehicle.make).toBe("WishlistTestCar");
            expect(wishlistItem.vehicle.model).toBe("ModelX");
        });
        it("should return an empty array when wishlist is empty", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/wishlist")
                .set("Authorization", `Bearer ${userToken}`);
            expect(res.status).toBe(200);
            expect(res.body.wishlist).toBeDefined();
            expect(Array.isArray(res.body.wishlist)).toBe(true);
            expect(res.body.wishlist.length).toBe(0);
        });
        it("should return 401 without authentication", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get("/api/wishlist");
            expect(res.status).toBe(401);
        });
    });
    describe("POST /api/wishlist", () => {
        it("should add a vehicle to wishlist", async () => {
            // Admin creates a test vehicle
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                make: "WishlistTestCar",
                model: "AddCar",
                category: "Sedan",
                price: 35000,
                quantity: 2,
            });
            const vehicleId = createRes.body.vehicle.id;
            // Add vehicle to wishlist
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/wishlist")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                vehicleId,
            });
            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Vehicle added to wishlist");
            expect(res.body.wishlist).toBeDefined();
            expect(res.body.wishlist.vehicleId).toBe(vehicleId);
            expect(res.body.wishlist.vehicle).toBeDefined();
        });
        it("should return 401 without authentication", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/wishlist")
                .send({
                vehicleId: "some-vehicle-id",
            });
            expect(res.status).toBe(401);
        });
    });
    describe("DELETE /api/wishlist/:vehicleId", () => {
        it("should remove a vehicle from wishlist", async () => {
            // Admin creates a test vehicle
            const createRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                make: "WishlistTestCar",
                model: "DeleteCar",
                category: "Hatchback",
                price: 25000,
                quantity: 4,
            });
            const vehicleId = createRes.body.vehicle.id;
            // Add vehicle first
            await (0, supertest_1.default)(app_1.default)
                .post("/api/wishlist")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                vehicleId,
            });
            // Remove vehicle
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/wishlist/${vehicleId}`)
                .set("Authorization", `Bearer ${userToken}`);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Vehicle removed from wishlist");
            // Verify wishlist is empty
            const wishlistRes = await (0, supertest_1.default)(app_1.default)
                .get("/api/wishlist")
                .set("Authorization", `Bearer ${userToken}`);
            expect(wishlistRes.body.wishlist.length).toBe(0);
        });
        it("should return 401 without authentication", async () => {
            const res = await (0, supertest_1.default)(app_1.default).delete("/api/wishlist/some-vehicle-id");
            expect(res.status).toBe(401);
        });
    });
});
