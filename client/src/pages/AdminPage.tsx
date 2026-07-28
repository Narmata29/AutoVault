import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Vehicle } from '../components/VehicleCard';
import { VehicleForm } from '../components/VehicleForm';
import { Plus, Edit2, Trash2, ArrowUpCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

const AdminPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Restock state
  const [restockVehicleId, setRestockVehicleId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState('');
  const [isRestocking, setIsRestocking] = useState(false);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data.vehicles || []);
    } catch (err) {
      setError('Failed to load inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string, make: string, model: string) => {
    if (!window.confirm(`Are you sure you want to delete the ${make} ${model}?`)) {
      return;
    }
    
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      alert('Failed to delete vehicle.');
    }
  };

  const handleRestock = async (id: string) => {
    if (!restockQty || isNaN(parseInt(restockQty, 10)) || parseInt(restockQty, 10) <= 0) {
      alert('Please enter a valid positive quantity.');
      return;
    }

    setIsRestocking(true);
    try {
      const response = await api.post(`/vehicles/${id}/restock`, { 
        quantity: parseInt(restockQty, 10) 
      });
      
      // Update local state
      setVehicles(vehicles.map(v => 
        v.id === id ? { ...v, quantity: response.data.vehicle.quantity } : v
      ));
      
      setRestockVehicleId(null);
      setRestockQty('');
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(err.response.data.error || 'Failed to restock.');
      }
    } finally {
      setIsRestocking(false);
    }
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const openNew = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage your dealership inventory.</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          Add New Vehicle
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                          {vehicle.imageUrl ? (
                            <img className="h-10 w-10 object-cover" src={vehicle.imageUrl} alt="" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-400">?</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.make} {vehicle.model}</div>
                          <div className="text-sm text-gray-500">{vehicle.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${vehicle.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restockVehicleId === vehicle.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            className="w-16 px-2 py-1 border rounded text-sm"
                            value={restockQty}
                            onChange={(e) => setRestockQty(e.target.value)}
                            placeholder="Qty"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRestock(vehicle.id)}
                            disabled={isRestocking}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            {isRestocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setRestockVehicleId(null)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-bold ${vehicle.quantity <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {vehicle.quantity}
                          </span>
                          <button
                            onClick={() => {
                              setRestockVehicleId(vehicle.id);
                              setRestockQty('');
                            }}
                            className="text-primary-600 hover:text-primary-800 text-xs font-medium flex items-center border border-primary-200 px-2 py-1 rounded bg-primary-50"
                            title="Restock"
                          >
                            <ArrowUpCircle className="w-3 h-3 mr-1" /> Add
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openEdit(vehicle)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle.id, vehicle.make, vehicle.model)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {vehicles.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No vehicles found in inventory. Click "Add New Vehicle" to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {isFormOpen && (
        <VehicleForm 
          initialData={editingVehicle}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;
