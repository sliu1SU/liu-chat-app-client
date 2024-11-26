import {fireEvent, render, screen} from '@testing-library/react';
import DisplayCurUser from "../src/DisplayCurUser.jsx";
import {UserContext} from "../src/UserContext.jsx";
import {describe} from "vitest";

// Mock useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),  // Mock useNavigate as a no-op function
    };
});

describe('test DisplayCurUser.jsx', () => {
    // Mock UserContext.Provider to provide a mocked user
    const mockUserContext = {
        user: null,
        setUser: vi.fn(),
        isLoading: false
    };

    it('print \'no user\' when there user object is null', () => {
        render(
            <UserContext.Provider value={mockUserContext}>
                <DisplayCurUser />
            </UserContext.Provider>
        );

        const text = screen.getByText(/No user.../i);
        expect(text).toBeInTheDocument();
    });

    it('calls logOffFn when "Log Off" button is clicked and user != null', () => {
        // Mock the logInFn and signUpFn
        const mockFn = vi.fn();

        // Render the component with a mocked UserContext and a non-null user object
        render(
            <UserContext.Provider value={{user: { id: "xx", email: "xx"}, setUser: vi.fn()}}>
                <DisplayCurUser logOffFn={mockFn}/>
            </UserContext.Provider>
        );

        // Get the Sign Up button
        const logOffButton = screen.getByRole('button', { name: /log off/i });
        expect(logOffButton).toBeInTheDocument();

        // Simulate the click event on Sign Up button
        fireEvent.click(logOffButton);

        // Check if signUpFn was called
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('user id and email are displayed when user != null', () => {
        // Render the component with a mocked UserContext and a non-null user object
        render(
            <UserContext.Provider value={{user: { uid: "xx", email: "xx"}, setUser: vi.fn()}}>
                <DisplayCurUser />
            </UserContext.Provider>
        );

        const text = screen.getByText(/uid: xx - email: xx/i);
        expect(text).toBeInTheDocument();
    });
});