import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VehicleCard } from '../VehicleCard';
import { AuthProvider } from '../../context/AuthContext';
// Mock the AuthContext since it's used inside the component
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: '1', name: 'Test User' }
    }),
    AuthProvider: ({ children }) => children
}));
describe('VehicleCard', () => {
    const mockVehicle = {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
        imageUrl: 'test-image.jpg'
    };
    it('renders vehicle details correctly', () => {
        render(<AuthProvider><VehicleCard vehicle={mockVehicle}/></AuthProvider>);
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
        expect(screen.getByText('Sedan')).toBeInTheDocument();
        expect(screen.getByText('25,000')).toBeInTheDocument();
        expect(screen.getByText('5 in stock')).toBeInTheDocument();
    });
    it('disables purchase button when out of stock', () => {
        const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
        render(<AuthProvider><VehicleCard vehicle={outOfStockVehicle}/></AuthProvider>);
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: /unavailable/i });
        expect(button).toBeDisabled();
    });
    it('enables purchase button when in stock', () => {
        render(<AuthProvider><VehicleCard vehicle={mockVehicle}/></AuthProvider>);
        const button = screen.getByRole('button', { name: /purchase/i });
        expect(button).not.toBeDisabled();
    });
});
