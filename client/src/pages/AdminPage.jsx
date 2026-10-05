import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { VehicleForm } from "../components/VehicleForm";
import { Plus, Edit2, Trash2, ArrowUpCircle, AlertCircle, Loader2, Save, X, Car, Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, BarChart3, CalendarDays, } from "lucide-react";
import { AxiosError } from "axios";
const AdminPage = () => {
    // =========================
    // Vehicle State
    // =========================
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    // =========================
    // Analytics State
    // =========================
    const [analytics, setAnalytics] = useState(null);
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState("");
    // =========================
    // Demand Insights State
    // =========================
    const [demandInsights, setDemandInsights] = useState([]);
    const [isDemandLoading, setIsDemandLoading] = useState(false);
    // =========================
    // Modal States
    // =========================
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    // =========================
    // Restock State
    // =========================
    const [restockVehicleId, setRestockVehicleId] = useState(null);
    const [restockQty, setRestockQty] = useState("");
    const [isRestocking, setIsRestocking] = useState(false);
    // =========================
    // Fetch Vehicles
    // =========================
    const fetchVehicles = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await api.get("/vehicles", {
                params: {
                    page: currentPage,
                    limit: 5,
                    sortBy,
                    order,
                },
            });
            setVehicles(response.data.vehicles || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
        }
        catch (err) {
            console.error("Failed to load inventory:", err);
            setError("Failed to load inventory.");
        }
        finally {
            setIsLoading(false);
        }
    };
    // =========================
    // Fetch Analytics
    // =========================
    const fetchAnalytics = async () => {
        setIsAnalyticsLoading(true);
        setAnalyticsError("");
        try {
            const response = await api.get("/admin/analytics");
            setAnalytics(response.data.analytics);
        }
        catch (err) {
            console.error("Failed to load analytics:", err);
            setAnalyticsError("Failed to load analytics. Please try again.");
        }
        finally {
            setIsAnalyticsLoading(false);
        }
    };
    // =========================
    // Fetch demand insights
    // =========================
    const fetchDemandInsights = async () => {
        setIsDemandLoading(true);
        try {
            const response = await api.get("/admin/demand-insights");
            setDemandInsights(response.data.insights);
        }
        catch (err) {
            console.error("Failed to load demand insights:", err);
        }
        finally {
            setIsDemandLoading(false);
        }
    };
    // =========================
    // Initial Load
    // =========================
    useEffect(() => {
        fetchVehicles();
        fetchAnalytics();
        fetchDemandInsights();
    }, [currentPage, sortBy, order]);
    // =========================
    // Delete Vehicle
    // =========================
    const handleDelete = async (id, make, model) => {
        if (!window.confirm(`Are you sure you want to delete the ${make} ${model}?`)) {
            return;
        }
        try {
            await api.delete(`/vehicles/${id}`);
            setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
            // Refresh analytics because inventory changed
            fetchAnalytics();
        }
        catch (err) {
            alert("Failed to delete vehicle.");
        }
    };
    // =========================
    // Restock Vehicle
    // =========================
    const handleRestock = async (id) => {
        const quantity = parseInt(restockQty, 10);
        if (!restockQty || isNaN(quantity) || quantity <= 0) {
            alert("Please enter a valid positive quantity.");
            return;
        }
        setIsRestocking(true);
        try {
            const response = await api.post(`/vehicles/${id}/restock`, {
                quantity,
            });
            // Update local vehicle state
            setVehicles(vehicles.map((vehicle) => vehicle.id === id
                ? {
                    ...vehicle,
                    quantity: response.data.vehicle.quantity,
                }
                : vehicle));
            setRestockVehicleId(null);
            setRestockQty("");
            // Refresh analytics because stock changed
            fetchAnalytics();
        }
        catch (err) {
            if (err instanceof AxiosError && err.response) {
                alert(err.response.data.error || "Failed to restock.");
            }
        }
        finally {
            setIsRestocking(false);
        }
    };
    // =========================
    // Open Edit Modal
    // =========================
    const openEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setIsFormOpen(true);
    };
    // =========================
    // Open Create Modal
    // =========================
    const openNew = () => {
        setEditingVehicle(null);
        setIsFormOpen(true);
    };
    // =========================
    // Helpers
    // =========================
    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString("en-IN")}`;
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    return (<div className="space-y-6 animate-fade-in"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h1 className="text-3xl font-bold text-gray-900 tracking-tight">{"Admin Dashboard"}</h1><p className="mt-1 text-gray-600">{"Manage your dealership inventory and analytics."}</p></div><button onClick={openNew} className="btn-primary flex items-center shadow-md"><Plus className="w-5 h-5 mr-2"/>{"Add New Vehicle"}</button></div>{analyticsError && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"><AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"/><p>{analyticsError}</p></div>)}{isAnalyticsLoading ? (<div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center py-16"><div className="text-center"><Loader2 className="h-10 w-10 text-primary-500 animate-spin mx-auto mb-3"/><p className="text-gray-500">{"Loading analytics..."}</p></div></div>) : analytics ? (<><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{"Total Vehicles"}</p><p className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalVehicles}</p></div><div className="bg-blue-100 p-3 rounded-xl"><Car className="h-6 w-6 text-blue-600"/></div></div></div><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{"Total Stock"}</p><p className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalStock}</p></div><div className="bg-indigo-100 p-3 rounded-xl"><Package className="h-6 w-6 text-indigo-600"/></div></div></div><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{"Total Orders"}</p><p className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalOrders}</p></div><div className="bg-purple-100 p-3 rounded-xl"><ShoppingCart className="h-6 w-6 text-purple-600"/></div></div></div><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{"Vehicles Sold"}</p><p className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalSales}</p></div><div className="bg-green-100 p-3 rounded-xl"><TrendingUp className="h-6 w-6 text-green-600"/></div></div></div></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl shadow-md p-5 text-white"><div className="flex items-center justify-between"><div><p className="text-sm text-blue-100">{"Total Revenue"}</p><p className="text-2xl font-bold mt-1">{formatCurrency(analytics.totalRevenue)}</p></div><DollarSign className="h-8 w-8 text-blue-200"/></div></div><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{"Inventory Value"}</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(analytics.inventoryValue)}</p></div><div className="bg-amber-100 p-3 rounded-xl"><DollarSign className="h-6 w-6 text-amber-600"/></div></div></div><div className={`rounded-xl border shadow-sm p-5 ${analytics.lowStockVehicles > 0
        ? "bg-red-50 border-red-200"
        : "bg-white border-gray-200"}`}><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{"Low Stock Vehicles"}</p><p className={`text-2xl font-bold mt-1 ${analytics.lowStockVehicles > 0
        ? "text-red-600"
        : "text-gray-900"}`}>{analytics.lowStockVehicles}</p></div><div className={`p-3 rounded-xl ${analytics.lowStockVehicles > 0
        ? "bg-red-100"
        : "bg-gray-100"}`}><AlertTriangle className={`h-6 w-6 ${analytics.lowStockVehicles > 0
        ? "text-red-600"
        : "text-gray-500"}`}/></div></div></div></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex items-center"><BarChart3 className="h-5 w-5 text-primary-600 mr-2"/><h2 className="font-bold text-gray-900">{"Sales by Category"}</h2></div><div className="p-5">{analytics.salesByCategory.length === 0 ? (<div className="text-center py-8 text-gray-500">{"No sales data available yet."}</div>) : (<div className="space-y-4">{analytics.salesByCategory.map((item) => (<div key={item.category}><div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-gray-700">{item.category}</span><span className="text-sm text-gray-500">{item.sales}{" sold"}</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full" style={{
        width: `${analytics.totalSales > 0
            ? Math.min(100, (item.sales / analytics.totalSales) * 100)
            : 0}%`,
    }}/></div><p className="text-xs text-gray-500 mt-1">{"Revenue: "}{formatCurrency(item.revenue)}</p></div>))}</div>)}</div></div><div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex items-center"><ShoppingCart className="h-5 w-5 text-primary-600 mr-2"/><h2 className="font-bold text-gray-900">{"Recent Purchases"}</h2></div><div className="divide-y divide-gray-100">{analytics.recentPurchases.length === 0 ? (<div className="text-center py-8 text-gray-500">{"No purchases yet."}</div>) : (analytics.recentPurchases.map((purchase) => (<div className="px-5 py-4 flex items-center justify-between" key={purchase.id}><div className="min-w-0"><p className="font-semibold text-gray-900 truncate">{purchase.vehicle.make}{" "}{purchase.vehicle.model}</p><p className="text-xs text-gray-500 mt-1">{purchase.user.name}{" • "}{purchase.vehicle.category}</p><div className="flex items-center text-xs text-gray-400 mt-1"><CalendarDays className="h-3.5 w-3.5 mr-1"/>{formatDate(purchase.createdAt)}</div></div><div className="text-right ml-4"><p className="font-bold text-primary-600">{formatCurrency(purchase.totalAmount)}</p><p className="text-xs text-gray-500">{"Qty: "}{purchase.quantity}</p></div></div>)))}</div></div></div></>) : null}{error && (<div className="mx-5 my-4 p-4 rounded-lg border border-red-200 bg-red-50"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-600"/><div><p className="font-medium text-red-700">{"Unable to load inventory"}</p><p className="text-sm text-red-600 mt-1">{"Please try again."}</p></div></div><button onClick={fetchVehicles} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-100 disabled:opacity-50">{"Retry"}</button></div></div>)}<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6"><div className="flex items-center justify-between mb-6"><div><h2 className="text-xl font-semibold text-gray-900">{"Demand Insights"}</h2><p className="text-sm text-gray-500 mt-1">{"Analyze vehicle demand and identify restocking needs."}</p></div><TrendingUp className="w-6 h-6 text-blue-600"/></div>{isDemandLoading ? (<div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-600"/></div>) : demandInsights.length === 0 ? (<div className="text-center py-10 text-gray-500">{"No demand data available."}</div>) : (<div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-200 text-left"><th className="py-3 px-4 text-sm font-medium text-gray-600">{"Vehicle"}</th><th className="py-3 px-4 text-sm font-medium text-gray-600">{"Category"}</th><th className="py-3 px-4 text-sm font-medium text-gray-600">{"Sales"}</th><th className="py-3 px-4 text-sm font-medium text-gray-600">{"Current Stock"}</th><th className="py-3 px-4 text-sm font-medium text-gray-600">{"Demand"}</th><th className="py-3 px-4 text-sm font-medium text-gray-600">{"Recommendation"}</th></tr></thead><tbody>{demandInsights.map((item) => (<tr className="border-b border-gray-100" key={item.vehicle.id}><td className="py-4 px-4"><div className="font-medium text-gray-900">{item.vehicle.make}{" "}{item.vehicle.model}</div><div className="text-sm text-gray-500">{"\u20B9"}{item.vehicle.price.toLocaleString()}</div></td><td className="py-4 px-4 text-sm text-gray-600">{item.vehicle.category}</td><td className="py-4 px-4 font-medium">{item.sales}</td><td className="py-4 px-4 font-medium">{item.vehicle.quantity}</td><td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${item.demand === "High"
        ? "bg-red-100 text-red-700"
        : item.demand === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"}`}>{item.demand}</span></td><td className="py-4 px-4">{item.restockRecommended ? (<span className="flex items-center gap-2 text-orange-600 text-sm font-medium"><AlertTriangle className="w-4 h-4"/>{"Restock Recommended"}</span>) : (<span className="text-gray-500 text-sm">{"Stock Sufficient"}</span>)}</td></tr>))}</tbody></table></div>)}</div>{isLoading ? (<div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-primary-500 animate-spin"/></div>) : (<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 className="text-lg font-bold text-gray-900">{"Vehicle Inventory"}</h2><p className="text-sm text-gray-500 mt-1">{"Manage vehicles, stock and actions."}</p></div><div className="flex items-center gap-3"><select value={sortBy} onChange={(e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="createdAt">{"Newest"}</option><option value="price">{"Price"}</option><option value="quantity">{"Stock"}</option><option value="make">{"Name"}</option></select><select value={order} onChange={(e) => {
        setOrder(e.target.value);
        setCurrentPage(1);
    }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="desc">{"Descending"}</option><option value="asc">{"Ascending"}</option></select></div></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{"Vehicle"}</th><th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{"Category"}</th><th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{"Price"}</th><th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{"Stock"}</th><th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{"Actions"}</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{vehicles.map((vehicle) => (<tr className="hover:bg-gray-50 transition-colors" key={vehicle.id}><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 overflow-hidden">{vehicle.imageUrl ? (<img className="h-10 w-10 object-cover" src={vehicle.imageUrl} alt=""/>) : (<div className="h-10 w-10 flex items-center justify-center text-gray-400">{"?"}</div>)}</div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{vehicle.make}{" "}{vehicle.model}</div><div className="text-sm text-gray-500">{vehicle.id.substring(0, 8)}{"..."}</div></div></div></td><td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{vehicle.category}</span></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(vehicle.price)}</td><td className="px-6 py-4 whitespace-nowrap">{restockVehicleId === vehicle.id ? (<div className="flex items-center space-x-2"><input type="number" min="1" className="w-16 px-2 py-1 border rounded text-sm" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} placeholder="Qty" autoFocus/><button onClick={() => handleRestock(vehicle.id)} disabled={isRestocking} className="text-green-600 hover:text-green-800 p-1" title="Save restock">{isRestocking ? (<Loader2 className="w-4 h-4 animate-spin"/>) : (<Save className="w-4 h-4"/>)}</button><button onClick={() => {
        setRestockVehicleId(null);
        setRestockQty("");
    }} className="text-gray-400 hover:text-gray-600 p-1" title="Cancel"><X className="w-4 h-4"/></button></div>) : (<div className="flex items-center space-x-3"><span className="text-sm font-bold text-gray-900">{vehicle.quantity}</span>{vehicle.quantity === 0 ? (<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{"Out of Stock"}</span>) : vehicle.quantity <= 2 ? (<span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{"Low Stock"}</span>) : (<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{"In Stock"}</span>)}<button onClick={() => {
        setRestockVehicleId(vehicle.id);
        setRestockQty("");
    }} className="text-primary-600 hover:text-primary-800 text-xs font-medium flex items-center border border-primary-200 px-2 py-1 rounded bg-primary-50" title="Restock"><ArrowUpCircle className="w-3 h-3 mr-1"/>{"Add"}</button></div>)}</td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => openEdit(vehicle)} className="text-indigo-600 hover:text-indigo-900 mr-4 p-1" title="Edit"><Edit2 className="w-4 h-4"/></button><button onClick={() => handleDelete(vehicle.id, vehicle.make, vehicle.model)} className="text-red-600 hover:text-red-900 p-1" title="Delete"><Trash2 className="w-4 h-4"/></button></td></tr>))}</tbody></table>{isLoading && (<div className="py-12 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin"/><p className="mt-3 text-sm text-gray-500">{"Loading inventory..."}</p></div>)}{!isLoading && vehicles.length === 0 && (<div className="py-12 text-center text-gray-500">{"No vehicles found in inventory. Click \"Add New Vehicle\" to get started."}</div>)}{!isLoading && vehicles.length > 0 && (<div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3"><p className="text-sm text-gray-500">{"Page "}{currentPage}{" of "}{totalPages}</p><div className="flex items-center gap-2"><button onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">{"Previous"}</button><button onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">{"Next"}</button></div></div>)}</div></div>)}{isFormOpen && (<VehicleForm initialData={editingVehicle} onClose={() => setIsFormOpen(false)} onSuccess={() => {
        setIsFormOpen(false);
        fetchVehicles();
        fetchAnalytics();
    }}/>)}</div>);
};
export default AdminPage;
