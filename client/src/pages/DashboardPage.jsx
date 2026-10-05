import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { VehicleCard } from "../components/VehicleCard";
import { SearchBar } from "../components/SearchBar";
import { PackageOpen, Loader2, AlertCircle } from "lucide-react";
import { RecommendationSection } from "../components/RecommendationSection";
const DashboardPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const fetchVehicles = useCallback(async (filters) => {
        setIsLoading(true);
        setError("");
        try {
            let endpoint = "/vehicles";
            // If there are filters, use the search endpoint
            if (filters && Object.values(filters).some((val) => val !== "")) {
                const queryParams = new URLSearchParams();
                if (filters.make)
                    queryParams.append("make", filters.make);
                if (filters.model)
                    queryParams.append("model", filters.model);
                if (filters.category)
                    queryParams.append("category", filters.category);
                if (filters.minPrice)
                    queryParams.append("minPrice", filters.minPrice);
                if (filters.maxPrice)
                    queryParams.append("maxPrice", filters.maxPrice);
                endpoint = `/vehicles/search?${queryParams.toString()}`;
            }
            const response = endpoint === "/vehicles"
                ? await api.get(endpoint, {
                    params: {
                        limit: 50,
                    },
                })
                : await api.get(endpoint);
            setVehicles(response.data.vehicles || []);
        }
        catch (err) {
            console.error("Failed to fetch vehicles:", err);
            setError("Failed to load inventory. Please try again later.");
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const fetchWishlist = useCallback(async () => {
        try {
            const response = await api.get("/wishlist");
            const ids = new Set((response.data.wishlist || []).map((item) => item.vehicleId));
            setWishlistIds(ids);
        }
        catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    }, []);
    // Initial load
    useEffect(() => {
        fetchVehicles();
        fetchWishlist();
    }, [fetchVehicles, fetchWishlist]);
    const handleSearch = useCallback((filters) => {
        fetchVehicles(filters);
    }, [fetchVehicles]);
    const handlePurchaseSuccess = (vehicleId) => {
        // Optimistically update the local state to decrease quantity
        setVehicles((prevVehicles) => prevVehicles.map((v) => v.id === vehicleId
            ? { ...v, quantity: Math.max(0, v.quantity - 1) }
            : v));
    };
    return (<div className="space-y-6"><div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 shadow-2xl group animate-fade-in"><img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2069" alt="Luxury Cars" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"/><div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"/><div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12"><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">{"Discover"}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-300">{"Excellence"}</span></h1><p className="text-slate-200 text-base sm:text-xl max-w-2xl font-light">{"Browse our premium selection of vehicles and find the perfect match for your lifestyle."}</p></div></div><RecommendationSection /><SearchBar onSearch={handleSearch}/>{error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"><AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"/><p>{error}</p></div>)}{isLoading ? (<div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4"/><p className="text-gray-500 font-medium">{"Loading inventory..."}</p></div>) : vehicles.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{vehicles.map((vehicle) => (<VehicleCard vehicle={vehicle} onPurchaseSuccess={handlePurchaseSuccess} isWishlisted={wishlistIds.has(vehicle.id)} key={vehicle.id}/>))}</div>) : (<div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-24 text-center px-4"><div className="bg-gray-100 p-4 rounded-full mb-4"><PackageOpen className="h-10 w-10 text-gray-400"/></div><h3 className="text-lg font-bold text-gray-900 mb-1">{"No vehicles found"}</h3><p className="text-gray-500 max-w-sm">{"We couldn't find any vehicles matching your search criteria. Try adjusting your filters."}</p><button onClick={() => fetchVehicles()} className="mt-6 btn-secondary">{"Clear Search"}</button></div>)}</div>);
};
export default DashboardPage;
