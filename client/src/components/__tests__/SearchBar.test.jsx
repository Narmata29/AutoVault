import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
describe('SearchBar', () => {
    it('calls onSearch with correct parameters after debouncing', async () => {
        const mockOnSearch = vi.fn();
        render(<SearchBar onSearch={mockOnSearch}/>);
        const input = screen.getByPlaceholderText(/search by make/i);
        fireEvent.change(input, { target: { value: 'Honda' } });
        // Should not be called immediately due to debounce
        expect(mockOnSearch).toHaveBeenCalledTimes(0);
        // Fast forward timers or wait
        await waitFor(() => {
            // Called after debounce
            expect(mockOnSearch).toHaveBeenCalledTimes(1);
        }, { timeout: 1000 });
        expect(mockOnSearch).toHaveBeenLastCalledWith(expect.objectContaining({
            make: 'Honda'
        }));
    });
    it('shows advanced filters when toggled', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBar onSearch={mockOnSearch}/>);
        const filterBtn = screen.getByRole('button', { name: /filters/i });
        fireEvent.click(filterBtn);
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('$ 0')).toBeInTheDocument();
    });
});
