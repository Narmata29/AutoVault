import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { History, Loader2, AlertCircle, PackageOpen, CalendarDays, Car, DollarSign, } from "lucide-react";
const PurchaseHistoryPage = () => {
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const fetchPurchases = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await api.get("/purchases");
            setPurchases(response.data.purchases || []);
        }
        catch (err) {
            console.error("Failed to fetch purchase history:", err);
            setError("Failed to load your purchase history. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchPurchases();
    }, []);
    const formatPrice = (price) => {
        return `₹${price.toLocaleString("en-IN")}`;
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4"/><p className="text-gray-500 font-medium">{"Loading purchase history..."}</p></div>);
    }
    const downloadInvoice = async (purchaseId) => {
        try {
            const response = await api.get(`/invoices/${purchaseId}`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${purchaseId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Failed to download invoice:", error);
            alert("Failed to download invoice.");
        }
    };
    return (<div className="space-y-6 animate-fade-in"><div className="flex items-center space-x-3"><div className="bg-gradient-to-br from-primary-500 to-blue-600 p-3 rounded-xl shadow-md"><History className="h-6 w-6 text-white"/></div><div><h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{"Purchase History"}</h1><p className="text-slate-500 mt-1">{"View your previous vehicle purchases"}</p></div></div>{error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"><AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"/><p>{error}</p></div>)}{!error && purchases.length === 0 && (<div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-24 text-center px-4"><div className="bg-gray-100 p-4 rounded-full mb-4"><PackageOpen className="h-10 w-10 text-gray-400"/></div><h3 className="text-lg font-bold text-gray-900 mb-1">{"No purchases yet"}</h3><p className="text-gray-500 max-w-sm">{"Your purchased vehicles will appear here once you make a purchase."}</p></div>)}{purchases.length > 0 && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{purchases.map((purchase) => (<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300" key={purchase.id}><div className="flex flex-col sm:flex-row"><div className="sm:w-48 h-48 sm:h-auto bg-slate-100 flex-shrink-0"><img src={purchase.vehicle.imageUrl ||
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop"} alt={`${purchase.vehicle.make} ${purchase.vehicle.model}`} className="w-full h-full object-cover" onError={(e) => {
        e.target.src =
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop";
    }}/></div><div className="p-5 flex-1"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">{purchase.vehicle.make}{" "}{purchase.vehicle.model}</h2><div className="flex items-center text-sm text-slate-500 mt-1"><Car className="h-4 w-4 mr-1"/>{purchase.vehicle.category}</div></div><span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">{"Purchased"}</span></div><div className="mt-4 space-y-3"><div className="flex items-center text-sm text-slate-600"><CalendarDays className="h-4 w-4 mr-2 text-slate-400"/><span>{"Purchased on "}{formatDate(purchase.createdAt)}</span></div><div className="flex items-center text-sm text-slate-600"><DollarSign className="h-4 w-4 mr-2 text-slate-400"/><span>{"Price at purchase:"}{" "}<strong className="text-slate-900">{formatPrice(purchase.priceAtPurchase)}</strong></span></div><div className="flex items-center justify-between pt-3 border-t border-slate-100"><div className="text-sm text-slate-500">{"Quantity: "}{purchase.quantity}</div><div className="text-lg font-bold text-primary-600">{formatPrice(purchase.totalAmount)}</div><button onClick={() => downloadInvoice(purchase.id)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{"Download Invoice"}</button></div></div></div></div></div>))}</div>)}</div>);
};
export default PurchaseHistoryPage;
