import React, { useEffect, useState } from "react";
import { Car, Tag, DollarSign, Package, Heart } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
export const VehicleCard = ({ vehicle, onPurchaseSuccess, isWishlisted: initialIsWishlisted = false, }) => {
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    useEffect(() => {
        setIsWishlisted(initialIsWishlisted);
    }, [initialIsWishlisted]);
    const { user } = useAuth();
    const isOutOfStock = vehicle.quantity <= 0;
    const handlePurchase = async () => {
        if (!user)
            return;
        setIsPurchasing(true);
        setError("");
        try {
            await api.post(`/vehicles/${vehicle.id}/purchase`);
            if (onPurchaseSuccess) {
                onPurchaseSuccess(vehicle.id);
            }
        }
        catch (err) {
            setError(err.response?.data?.error || "Purchase failed");
            setTimeout(() => setError(""), 3000);
        }
        finally {
            setIsPurchasing(false);
        }
    };
    const handleWishlist = async () => {
        if (!user)
            return;
        setIsWishlistLoading(true);
        setError("");
        try {
            if (isWishlisted) {
                await api.delete(`/wishlist/${vehicle.id}`);
                setIsWishlisted(false);
            }
            else {
                await api.post("/wishlist", {
                    vehicleId: vehicle.id,
                });
                setIsWishlisted(true);
            }
        }
        catch (err) {
            setError(err.response?.data?.error ||
                err.response?.data?.message ||
                "Wishlist update failed");
            setTimeout(() => setError(""), 3000);
        }
        finally {
            setIsWishlistLoading(false);
        }
    };
    const defaultImage = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop";
    return (<div className="card group relative flex flex-col h-full"><div className="relative aspect-[3/2] overflow-hidden bg-gray-200">{user && (<button onClick={handleWishlist} disabled={isWishlistLoading} className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50" aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}><Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}/></button>)}<img src={vehicle.imageUrl || defaultImage} alt={`${vehicle.make} ${vehicle.model}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" onError={(e) => {
        e.target.src = defaultImage;
    }}/>{isOutOfStock && (<div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300"><span className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-5 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-xl transform -rotate-6 border border-white/20">{"Out of Stock"}</span></div>)}</div><div className="p-5 flex-1 flex flex-col"><div className="flex justify-between items-start mb-2"><div><h3 className="text-xl font-bold text-gray-900 line-clamp-1">{vehicle.make}{" "}{vehicle.model}</h3><div className="flex items-center text-gray-500 text-sm mt-1"><Tag className="w-3.5 h-3.5 mr-1"/><span>{vehicle.category}</span></div></div><div className="bg-gradient-to-r from-primary-600 to-blue-500 px-3 py-1.5 rounded-xl text-white font-bold flex items-center shadow-md"><DollarSign className="w-4 h-4 mr-0.5 opacity-80"/>{vehicle.price.toLocaleString()}</div></div><div className="mt-4 flex items-center justify-between text-sm text-gray-600 pb-4 border-b border-gray-100"><div className="flex items-center"><Package className="w-4 h-4 mr-1.5 text-gray-400"/><span className={isOutOfStock ? "text-red-500 font-medium" : ""}>{vehicle.quantity}{" in stock"}</span></div><div className="flex items-center"><Car className="w-4 h-4 mr-1.5 text-gray-400"/><span>{"New"}</span></div></div><div className="mt-auto pt-4 relative">{error && (<div className="absolute -top-10 left-0 w-full bg-red-100 text-red-700 text-xs text-center py-1 rounded animate-fade-in">{error}</div>)}<button onClick={handlePurchase} disabled={isOutOfStock || isPurchasing} className="w-full btn-primary flex justify-center items-center py-2.5 text-sm uppercase tracking-wide">{isPurchasing
        ? "Processing..."
        : isOutOfStock
            ? "Unavailable"
            : "Purchase"}</button></div></div></div>);
};
