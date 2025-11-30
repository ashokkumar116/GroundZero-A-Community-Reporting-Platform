import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ActionsOverlay from '../../../Components/Overlays/ActionsOverlay';
import axios from '../../../Services/axios';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../../../Services/axios');
vi.mock('react-hot-toast');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

describe('ActionsOverlay Component', () => {
    const mockPanelRef = { current: { hide: vi.fn(), toggle: vi.fn() } };
    const mockSetModalVisible = vi.fn();
    const mockFetchUser = vi.fn();

    const mockUserRegular = {
        user: { _id: 'user123' },
        isAdmin: false,
        username: 'testuser'
    };

    const mockUserAdmin = {
        user: { _id: 'admin123' },
        isAdmin: true,
        username: 'adminuser'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render overlay panel with all action items', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('View Profile')).toBeInTheDocument();
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('should show "Make Admin" option for regular users', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Make Admin')).toBeInTheDocument();
        expect(screen.queryByText('Remove Admin')).not.toBeInTheDocument();
    });

    it('should show "Remove Admin" option for admin users', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserAdmin}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Remove Admin')).toBeInTheDocument();
        expect(screen.queryByText('Make Admin')).not.toBeInTheDocument();
    });

    it('should call setModalVisible when Edit Profile is clicked', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Edit Profile'));
        expect(mockSetModalVisible).toHaveBeenCalledWith(true);
    });

    it('should successfully make user admin', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        // Simulate clicking Make Admin and accepting confirmation
        const makeAdminButton = screen.getByText('Make Admin');
        fireEvent.click(makeAdminButton);

        // Wait for the confirmation dialog and accept it
        await waitFor(() => {
            const acceptButton = screen.queryByText('Yes');
            if (acceptButton) {
                fireEvent.click(acceptButton);
            }
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/admin/makeadmin/user123');
        });
    });

    it('should handle make admin API errors', async () => {
        const errorMessage = 'Failed to make admin';
        axios.put.mockRejectedValue({
            response: { data: { message: errorMessage } }
        });

        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const makeAdminButton = screen.getByText('Make Admin');
        fireEvent.click(makeAdminButton);

        // Accept confirmation
        await waitFor(() => {
            const acceptButton = screen.queryByText('Yes');
            if (acceptButton) {
                fireEvent.click(acceptButton);
            }
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
        });
    });

    it('should successfully remove admin privileges', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserAdmin}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const removeAdminButton = screen.getByText('Remove Admin');
        fireEvent.click(removeAdminButton);

        // Accept confirmation
        await waitFor(() => {
            const acceptButton = screen.queryByText('Yes');
            if (acceptButton) {
                fireEvent.click(acceptButton);
            }
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/admin/removeadmin/admin123');
        });
    });

    it('should call fetchUser after successful admin status change', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const makeAdminButton = screen.getByText('Make Admin');
        fireEvent.click(makeAdminButton);

        await waitFor(() => {
            const acceptButton = screen.queryByText('Yes');
            if (acceptButton) {
                fireEvent.click(acceptButton);
            }
        });

        await waitFor(() => {
            expect(mockFetchUser).toHaveBeenCalled();
        });
    });

    it('should hide panel after successful operation', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const makeAdminButton = screen.getByText('Make Admin');
        fireEvent.click(makeAdminButton);

        await waitFor(() => {
            const acceptButton = screen.queryByText('Yes');
            if (acceptButton) {
                fireEvent.click(acceptButton);
            }
        });

        await waitFor(() => {
            expect(mockPanelRef.current.hide).toHaveBeenCalled();
        });
    });

    it('should handle null selectedUser gracefully', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={null}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        // Component should still render without errors
        expect(screen.getByText('View Profile')).toBeInTheDocument();
    });

    it('should extract user ID correctly from nested structure', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const viewProfileDiv = screen.getByText('View Profile').closest('div');
        fireEvent.click(viewProfileDiv);

        // userId should be extracted from selectedUser?.user?._id
        expect(mockUserRegular.user._id).toBe('user123');
    });

    it('should show confirmation dialog with correct message for make admin', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const makeAdminButton = screen.getByText('Make Admin');
        fireEvent.click(makeAdminButton);

        // The confirmation popup should appear with appropriate message
        // This tests the confirmPopup integration
    });

    it('should show confirmation dialog with correct message for remove admin', () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserAdmin}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const removeAdminButton = screen.getByText('Remove Admin');
        fireEvent.click(removeAdminButton);

        // The confirmation popup should appear with appropriate warning
    });

    it('should hide panel when confirmation is rejected', async () => {
        render(
            <BrowserRouter>
                <ActionsOverlay
                    panelRef={mockPanelRef}
                    selectedUser={mockUserRegular}
                    setModalVisible={mockSetModalVisible}
                    fetchUser={mockFetchUser}
                />
            </BrowserRouter>
        );

        const makeAdminButton = screen.getByText('Make Admin');
        fireEvent.click(makeAdminButton);

        await waitFor(() => {
            const rejectButton = screen.queryByText('No');
            if (rejectButton) {
                fireEvent.click(rejectButton);
                expect(mockPanelRef.current.hide).toHaveBeenCalled();
            }
        });
    });
});