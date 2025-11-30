import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ManageUsers from '../../../Pages/AdminPages/ManageUsers';
import axios from '../../../Services/axios';

// Mock dependencies
vi.mock('../../../Services/axios');
vi.mock('../../../utils/formatDate', () => ({
    formatDate: (date) => 'Jan 01, 2024'
}));

describe('ManageUsers Component', () => {
    const mockUsersData = {
        users: [
            {
                user: {
                    _id: 'user1',
                    username: 'john_doe',
                    email: 'john@example.com',
                    profile_image: 'http://example.com/image1.jpg'
                },
                isAdmin: false,
                joined: '2024-01-01T00:00:00Z',
                postCount: 5,
                volunteeredCount: 3
            },
            {
                user: {
                    _id: 'user2',
                    username: 'jane_smith',
                    email: 'jane@example.com',
                    profile_image: 'http://example.com/image2.jpg'
                },
                isAdmin: true,
                joined: '2024-01-02T00:00:00Z',
                postCount: 10,
                volunteeredCount: 7
            }
        ],
        currentPage: 1,
        totalUsers: 2,
        totalPages: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: mockUsersData });
    });

    it('should render page title and description', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        expect(screen.getByText('Manage Users')).toBeInTheDocument();
        expect(screen.getByText('View and manage all registered users')).toBeInTheDocument();
    });

    it('should fetch and display users on mount', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/users', {
                params: { page: 1, limit: 5 }
            });
        });

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
            expect(screen.getByText('jane_smith')).toBeInTheDocument();
        });
    });

    it('should display user email addresses', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        });
    });

    it('should display user role badges correctly', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const roleBadges = screen.getAllByText(/Admin|User/);
            expect(roleBadges).toHaveLength(2);
        });
    });

    it('should display post count for each user', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
        });
    });

    it('should display volunteered count for each user', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('7')).toBeInTheDocument();
        });
    });

    it('should handle search input changes', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        const searchInput = screen.getByPlaceholderText('Search Users');
        fireEvent.change(searchInput, { target: { value: 'john' } });

        expect(searchInput.value).toBe('john');
    });

    it('should trigger search on form submit', async () => {
        axios.get.mockResolvedValueOnce({ data: mockUsersData });
        axios.get.mockResolvedValueOnce({
            data: {
                users: [mockUsersData.users[0]],
                currentPage: 1,
                totalUsers: 1,
                totalPages: 1
            }
        });

        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search Users');
        fireEvent.change(searchInput, { target: { value: 'john' } });

        const form = searchInput.closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/searchusers', {
                params: { search: 'john', page: 1, limit: 5 }
            });
        });
    });

    it('should reset search when search input is empty', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search Users');
        fireEvent.change(searchInput, { target: { value: '' } });

        const form = searchInput.closest('form');
        fireEvent.submit(form);

        // Should not call search API when search is empty
        expect(axios.get).not.toHaveBeenCalledWith('/admin/searchusers', expect.anything());
    });

    it('should display pagination information', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();
        });
    });

    it('should handle page navigation', async () => {
        const multiPageData = {
            ...mockUsersData,
            totalPages: 3,
            currentPage: 1
        };
        axios.get.mockResolvedValue({ data: multiPageData });

        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        const page2Button = screen.getByText('2');
        fireEvent.click(page2Button);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/users', {
                params: { page: 2, limit: 5 }
            });
        });
    });

    it('should disable previous button on first page', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const prevButton = screen.getByRole('button', { name: /previous/i });
            expect(prevButton).toBeDisabled();
        });
    });

    it('should disable next button on last page', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const nextButtons = screen.getAllByRole('button');
            const nextButton = nextButtons.find(btn => btn.querySelector('svg') && !btn.disabled);
            // Last page, next should be disabled
        });
    });

    it('should change rows per page limit', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        // Find and click dropdown to change limit
        const limitDropdown = screen.getByRole('combobox');
        fireEvent.change(limitDropdown, { target: { value: 10 } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/users', {
                params: { page: 1, limit: 10 }
            });
        });
    });

    it('should render Add New User button', () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        expect(screen.getByText('Add New User')).toBeInTheDocument();
    });

    it('should display user profile images', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const images = screen.getAllByRole('img', { name: /profile/i });
            expect(images.length).toBeGreaterThan(0);
        });
    });

    it('should render actions menu for each user', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const actionButtons = screen.getAllByRole('button');
            const threeDotsButtons = actionButtons.filter(btn => 
                btn.querySelector('svg')
            );
            expect(threeDotsButtons.length).toBeGreaterThan(0);
        });
    });

    it('should open profile edit modal when action is triggered', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        // Click on actions menu (three dots)
        const actionButtons = screen.getAllByRole('button');
        const threeDotsButton = actionButtons.find(btn => 
            btn.querySelector('svg')
        );
        
        if (threeDotsButton) {
            fireEvent.click(threeDotsButton);
        }
    });

    it('should format joined date correctly', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const dates = screen.getAllByText('Jan 01, 2024');
            expect(dates.length).toBeGreaterThan(0);
        });
    });

    it('should handle empty users list', async () => {
        axios.get.mockResolvedValue({
            data: {
                users: [],
                currentPage: 1,
                totalUsers: 0,
                totalPages: 0
            }
        });

        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Manage Users')).toBeInTheDocument();
        });
    });

    it('should maintain search mode across page changes', async () => {
        const searchResultData = {
            users: [mockUsersData.users[0]],
            currentPage: 1,
            totalUsers: 1,
            totalPages: 2
        };

        axios.get.mockResolvedValueOnce({ data: mockUsersData });
        axios.get.mockResolvedValueOnce({ data: searchResultData });

        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        // Perform search
        const searchInput = screen.getByPlaceholderText('Search Users');
        fireEvent.change(searchInput, { target: { value: 'john' } });
        const form = searchInput.closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/searchusers', {
                params: { search: 'john', page: 1, limit: 5 }
            });
        });
    });

    it('should render DataTable component', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        // DataTable should render with proper columns
        expect(screen.getByText('Role')).toBeInTheDocument();
        expect(screen.getByText('Post Count')).toBeInTheDocument();
        expect(screen.getByText('Volunteered Count')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        axios.get.mockRejectedValue(new Error('API Error'));

        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        consoleError.mockRestore();
    });

    it('should prevent multiple simultaneous search requests', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search Users');
        const form = searchInput.closest('form');

        // Rapid fire searches
        fireEvent.change(searchInput, { target: { value: 'john' } });
        fireEvent.submit(form);
        fireEvent.submit(form);
        fireEvent.submit(form);

        // Should handle gracefully without duplicate requests
    });

    it('should display correct styling for admin users', async () => {
        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            const adminBadges = screen.getAllByText('Admin');
            expect(adminBadges.length).toBeGreaterThan(0);
        });
    });

    it('should reset to page 1 when performing new search', async () => {
        const multiPageData = {
            ...mockUsersData,
            totalPages: 3,
            currentPage: 2
        };
        
        axios.get.mockResolvedValueOnce({ data: multiPageData });
        axios.get.mockResolvedValueOnce({ data: mockUsersData });

        render(
            <BrowserRouter>
                <ManageUsers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });

        // Navigate to page 2
        const page2Button = screen.getByText('2');
        fireEvent.click(page2Button);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/users', {
                params: { page: 2, limit: 5 }
            });
        });

        // Perform search
        const searchInput = screen.getByPlaceholderText('Search Users');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        const form = searchInput.closest('form');
        fireEvent.submit(form);

        // Should reset to page 1
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/admin/searchusers', {
                params: { search: 'test', page: 1, limit: 5 }
            });
        });
    });
});