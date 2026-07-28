import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { VehicleCard, Vehicle } from '../components/VehicleCard';
import { SearchBar, SearchFilters } from '../components/SearchBar';
import { PackageOpen, Loader2, AlertCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVehicles = useCallback(async (filters?: SearchFilters) => {
    setIsLoading(true);
    setError('');
    
    try {
      let endpoint = '/vehicles';
      
      // If there are filters, use the search endpoint
      if (filters && Object.values(filters).some(val => val !== '')) {
        const queryParams = new URLSearchParams();
        
        if (filters.make) queryParams.append('make', filters.make);
        if (filters.model) queryParams.append('model', filters.model);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        
        endpoint = `/vehicles/search?${queryParams.toString()}`;
      }
      
      const response = await api.get(endpoint);
      setVehicles(response.data.vehicles || []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Failed to load inventory. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (filters: SearchFilters) => {
    fetchVehicles(filters);
  };

  const handlePurchaseSuccess = (vehicleId: string) => {
    // Optimistically update the local state to decrease quantity
    setVehicles(prevVehicles => 
      prevVehicles.map(v => 
        v.id === vehicleId ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory</h1>
        <p className="mt-2 text-gray-600">Browse and purchase vehicles from our premium selection.</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading inventory...</p>
        </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onPurchaseSuccess={handlePurchaseSuccess}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <PackageOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No vehicles found</h3>
          <p className="text-gray-500 max-w-sm">
            We couldn't find any vehicles matching your search criteria. Try adjusting your filters.
          </p>
          <button 
            onClick={() => fetchVehicles()}
            className="mt-6 btn-secondary"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
