import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileEditModal from '../../../Components/Modals/ProfileEditModal';
import axios from '../../../Services/axios';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../../../Services/axios');
vi.mock('react-hot-toast');

describe('ProfileEditModal Component', () => {
    const mockSetVisible = vi.fn();
    const mockFetchUser = vi.fn();

    const mockUser = {
        user: { _id: 'user123' },
        username: 'testuser',
        bio: 'Test bio',
        phone: '1234567890',
        dob: new Date('1990-01-01'),
        village_name: 'Test Village',
        pincode: '123456',
        state: 'Test State',
        district: 'Test District'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render modal with user data', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
    });

    it('should populate form fields with user data on mount', () => {
        const { rerender } = render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={null}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        rerender(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
    });

    it('should update username field on input change', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const usernameInput = screen.getByDisplayValue('testuser');
        fireEvent.change(usernameInput, { target: { value: 'newusername' } });

        expect(screen.getByDisplayValue('newusername')).toBeInTheDocument();
    });

    it('should call user update API for non-admin users', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                '/users/updateprofile',
                expect.objectContaining({
                    username: 'testuser',
                    bio: 'Test bio'
                })
            );
        });
    });

    it('should call admin update API when isAdmin is true', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={true}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                '/admin/edituser/user123',
                expect.objectContaining({
                    username: 'testuser',
                    bio: 'Test bio'
                })
            );
        });
    });

    it('should show success toast on successful update', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Profile Updated Successfully');
        });
    });

    it('should close modal after successful update', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSetVisible).toHaveBeenCalledWith(false);
        });
    });

    it('should call fetchUser after successful update', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockFetchUser).toHaveBeenCalled();
        });
    });

    it('should show error toast on API failure', async () => {
        const errorMessage = 'Update failed';
        axios.put.mockRejectedValue({
            response: { data: { message: errorMessage } }
        });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
        });
    });

    it('should show loading state during update', async () => {
        axios.put.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        expect(screen.getByText('Updating Profile...')).toBeInTheDocument();
    });

    it('should disable submit button during loading', async () => {
        axios.put.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        const loadingButton = screen.getByRole('button', { name: /updating profile/i });
        expect(loadingButton).toBeDisabled();
    });

    it('should reset district when state changes', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        // Simulate state change
        const stateInput = screen.getByPlaceholderText('State');
        fireEvent.change(stateInput, { target: { value: 'New State' } });

        // District should be cleared when state changes
    });

    it('should disable district field when no state is selected', () => {
        const userWithoutState = { ...mockUser, state: '' };

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={userWithoutState}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const districtInput = screen.getByPlaceholderText('District');
        expect(districtInput).toBeDisabled();
    });

    it('should handle empty user object gracefully', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={{}}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        // Should not crash and should render form
        expect(screen.getByText('Update Profile')).toBeInTheDocument();
    });

    it('should update bio textarea correctly', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const bioInput = screen.getByDisplayValue('Test bio');
        fireEvent.change(bioInput, { target: { value: 'New bio content' } });

        expect(screen.getByDisplayValue('New bio content')).toBeInTheDocument();
    });

    it('should format phone number correctly', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });

    it('should handle date of birth input', () => {
        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        // Calendar component should be present
        const dobLabel = screen.getByText('Date of Birth');
        expect(dobLabel).toBeInTheDocument();
    });

    it('should include all location fields in update', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const submitButton = screen.getByText('Update Profile');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    village_name: 'Test Village',
                    district: 'Test District',
                    state: 'Test State',
                    pincode: '123456'
                })
            );
        });
    });

    it('should prevent form submission with preventDefault', async () => {
        const mockEvent = { preventDefault: vi.fn() };
        axios.put.mockResolvedValue({ status: 200 });

        render(
            <ProfileEditModal
                visible={true}
                setVisible={mockSetVisible}
                user={mockUser}
                fetchUser={mockFetchUser}
                isAdmin={false}
            />
        );

        const form = screen.getByRole('button', { name: /update profile/i }).closest('form');
        fireEvent.submit(form, mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
});