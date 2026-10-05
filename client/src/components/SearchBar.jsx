import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
export const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);
    // Debounce search
    useEffect(() => {
        setIsDebouncing(true);
        const timer = setTimeout(() => {
            onSearch(filters);
            setIsDebouncing(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, onSearch]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    const clearFilters = () => {
        setFilters({
            make: '',
            model: '',
            category: '',
            minPrice: '',
            maxPrice: '',
        });
    };
    const hasActiveFilters = Object.values(filters).some(val => val !== '');
    return (<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8"><div className="flex flex-col md:flex-row gap-4 items-center"><div className="relative flex-1 w-full"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400"/></div><input type="text" name="make" value={filters.make} onChange={handleChange} className="input-field pl-10" placeholder="Search by make (e.g., Toyota, BMW)..."/>{isDebouncing && (<div className="absolute inset-y-0 right-3 flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"/></div>)}</div><button onClick={() => setShowAdvanced(!showAdvanced)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${showAdvanced ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}><SlidersHorizontal className="h-5 w-5"/><span>{"Filters"}</span></button>{hasActiveFilters && (<button onClick={clearFilters} className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"><X className="h-4 w-4"/><span>{"Clear"}</span></button>)}</div>{showAdvanced && (<div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in"><div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{"Model"}</label><input type="text" name="model" value={filters.model} onChange={handleChange} className="input-field py-1.5 text-sm" placeholder="Any model"/></div><div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{"Category"}</label><select name="category" value={filters.category} onChange={handleChange} className="input-field py-1.5 text-sm"><option value="">{"All Categories"}</option><option value="Sedan">{"Sedan"}</option><option value="SUV">{"SUV"}</option><option value="Truck">{"Truck"}</option><option value="Sports">{"Sports"}</option><option value="Luxury">{"Luxury"}</option><option value="Electric">{"Electric"}</option></select></div><div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{"Min Price"}</label><input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} className="input-field py-1.5 text-sm" placeholder="$ 0" min="0"/></div><div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{"Max Price"}</label><input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} className="input-field py-1.5 text-sm" placeholder="$ Any" min="0"/></div></div>)}</div>);
};
