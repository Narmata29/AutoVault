import React, { useState } from "react";
import api from "../api/axios";
import { Search, Loader2, Star } from "lucide-react";
export const RecommendationSection = () => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [category, setCategory] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const getRecommendations = async () => {
        setIsLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (minPrice) {
                params.append("minPrice", minPrice);
            }
            if (maxPrice) {
                params.append("maxPrice", maxPrice);
            }
            if (category) {
                params.append("category", category);
            }
            const response = await api.get(`/recommendations?${params.toString()}`);
            setRecommendations(response.data.recommendations || []);
        }
        catch (err) {
            console.error("Failed to get recommendations:", err);
            setError("Failed to get recommendations. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="mb-6"><h2 className="text-xl font-bold text-gray-900">{"Find Your Perfect Car \uD83D\uDE97"}</h2><p className="text-gray-600 mt-1">{"Tell us your preferences and we'll recommend vehicles for you."}</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">{"Minimum Budget"}</label><input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="e.g. 30000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">{"Maximum Budget"}</label><input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="e.g. 65000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">{"Category"}</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"><option value="">{"Any Category"}</option><option value="SUV">{"SUV"}</option><option value="Sedan">{"Sedan"}</option><option value="Luxury">{"Luxury"}</option><option value="Electric">{"Electric"}</option><option value="Sports">{"Sports"}</option><option value="Truck">{"Truck"}</option></select></div></div><button onClick={getRecommendations} disabled={isLoading} className="mt-5 btn-primary flex items-center justify-center">{isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>{"Finding Cars..."}</>) : (<><Search className="w-4 h-4 mr-2"/>{"Get Recommendations"}</>)}</button>{error && (<div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>)}{recommendations.length > 0 && (<div className="mt-8"><h3 className="text-lg font-semibold text-gray-900 mb-4">{"Recommended for You"}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{recommendations.map((item) => (<div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow" key={item.vehicle.id}><div className="flex gap-4"><div className="w-24 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">{item.vehicle.imageUrl ? (<img src={item.vehicle.imageUrl} alt={`${item.vehicle.make} ${item.vehicle.model}`} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">{"No Image"}</div>)}</div><div className="flex-1"><div className="flex justify-between items-start"><div><h4 className="font-bold text-gray-900">{item.vehicle.make}{" "}{item.vehicle.model}</h4><p className="text-sm text-gray-500">{item.vehicle.category}</p></div><div className="flex items-center text-green-600 font-semibold"><Star className="w-4 h-4 mr-1 fill-current"/>{Math.round(item.score)}{"% Match"}</div></div><p className="text-lg font-bold text-primary-600 mt-2">{"\u20B9"}{item.vehicle.price.toLocaleString("en-IN")}</p></div></div>{item.reasons.length > 0 && (<div className="mt-4 pt-3 border-t border-gray-100"><p className="text-xs font-semibold text-gray-500 mb-2">{"Why we recommend it"}</p><div className="flex flex-wrap gap-2">{item.reasons.map((reason, index) => (<span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full" key={index}>{"\u2713 "}{reason}</span>))}</div></div>)}</div>))}</div></div>)}{!isLoading && recommendations.length === 0 && !error && (<p className="mt-6 text-sm text-gray-500 text-center">{"Select your preferences and click \"Get Recommendations\"."}</p>)}</section>);
};
