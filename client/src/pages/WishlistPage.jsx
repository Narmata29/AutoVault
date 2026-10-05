import React, { useCallback, useEffect, useState } from 'react';
import { Heart, Loader2, PackageOpen, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { VehicleCard } from '../components/VehicleCard';
const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchWishlist = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get('/wishlist');
            setWishlist(response.data.wishlist || []);
        }
        catch (err) {
            console.error('Failed to fetch wishlist:', err);
            setError('Failed to load your wishlist.');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);
    const handleRemove = async (vehicleId) => {
        try {
            await api.delete(`/wishlist/${vehicleId}`);
            setWishlist((prev) => prev.filter((item) => item.vehicleId !== vehicleId));
        }
        catch (err) {
            console.error('Failed to remove from wishlist:', err);
            setError('Failed to remove vehicle from wishlist.');
        }
    };
    const handlePurchaseSuccess = (vehicleId) => {
        setWishlist((prev) => prev.map((item) => item.vehicleId === vehicleId
            ? {
                ...item,
                vehicle: {
                    ...item.vehicle,
                    quantity: Math.max(0, item.vehicle.quantity - 1),
                },
            }
            : item));
    };
    return (<div className="space-y-6"><div className="flex items-center gap-3"><div className="p-3 bg-red-100 rounded-xl"><Heart className="w-6 h-6 text-red-500 fill-red-500"/></div><div><h1 className="text-2xl font-bold text-gray-900">{"My Wishlist"}</h1><p className="text-gray-500 text-sm">{"Vehicles you've saved for later."}</p></div></div>{error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>)}{isLoading ? (<div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-3"/><p className="text-gray-500">{"Loading wishlist..."}</p></div>) : wishlist.length === 0 ? (<div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-24 text-center px-4"><div className="bg-gray-100 p-4 rounded-full mb-4"><PackageOpen className="h-10 w-10 text-gray-400"/></div><h3 className="text-lg font-bold text-gray-900 mb-1">{"Your wishlist is empty"}</h3><p className="text-gray-500 max-w-sm">{"Save vehicles you like and find them here later."}</p></div>) : (<><p className="text-sm text-gray-500">{wishlist.length}{' '}{wishlist.length === 1 ? 'vehicle' : 'vehicles'}{" saved"}</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{wishlist.map((item) => (<div className="relative" key={item.id}><VehicleCard vehicle={item.vehicle} isWishlisted onPurchaseSuccess={handlePurchaseSuccess}/><button onClick={() => handleRemove(item.vehicleId)} className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="Remove from wishlist"><Trash2 className="w-4 h-4"/></button></div>))}</div></>)}</div>);
};
export default WishlistPage;
