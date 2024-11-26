import {fireEvent, render, screen} from '@testing-library/react';
import SignInAndUp from '../src/SignInAndUp.jsx';
import {UserContext} from "../src/UserContext.jsx";
import {MemoryRouter} from "react-router-dom";

// Mock useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),  // Mock useNavigate as a no-op function
    };
});

describe('test SignInAndUp.jsx', () => {
    it('renders Log In and Sign Up buttons', () => {
        render(
            <UserContext.Provider value={{ user: null, setUser: () => {} }}>
                <SignInAndUp />
            </UserContext.Provider>
        );

        // Check if the "Log In" button is rendered
        const logInButton = screen.getByRole('button', { name: /log in/i });
        expect(logInButton).toBeInTheDocument();

        // Check if the "Sign Up" button is rendered
        const signUpButton = screen.getByRole('button', { name: /sign up/i });
        expect(signUpButton).toBeInTheDocument();
    });

    it('calls signUpFn when "Sign Up" button is clicked', () => {
        // Mock the logInFn and signUpFn
        const mockSignupFn = vi.fn();
        const mockLoginFn = vi.fn();

        render(
            <UserContext.Provider value={{ user: null, setUser: () => {} }}>
                <SignInAndUp signUpFn={mockSignupFn} logInFn={mockLoginFn}/>
            </UserContext.Provider>
        );

        // Get the Sign Up button
        const signUpButton = screen.getByRole('button', { name: /sign up/i });

        // Simulate the click event on Sign Up button
        fireEvent.click(signUpButton);

        // Check if signUpFn was called
        expect(mockSignupFn).toHaveBeenCalledTimes(1);
        expect(mockLoginFn).not.toHaveBeenCalled();  // Ensure logInFn was not called
    });

    it('calls logInFn when "Log In" button is clicked', () => {
        // Mock the logInFn and signUpFn
        const mockSignupFn = vi.fn();
        const mockLoginFn = vi.fn();

        render(
            <UserContext.Provider value={{ user: null, setUser: () => {} }}>
                <SignInAndUp signUpFn={mockSignupFn} logInFn={mockLoginFn}/>
            </UserContext.Provider>
        );

        // Get the Sign Up button
        const logInButton = screen.getByRole('button', { name: /log in/i });

        // Simulate the click event on Sign Up button
        fireEvent.click(logInButton);

        // Check if signUpFn was called
        expect(mockLoginFn).toHaveBeenCalledTimes(1);
        expect(mockSignupFn).not.toHaveBeenCalled();  // Ensure logInFn was not called
    });

    it('renders Log In and Sign Up buttons and input fields', () => {
        render(
            <UserContext.Provider value={{ user: null, setUser: () => {} }}>
                <SignInAndUp />
            </UserContext.Provider>
        );

        // Check if the email input is rendered
        const emailInput = screen.getByPlaceholderText(/enter email here.../i);
        expect(emailInput).toBeInTheDocument();

        // Check if the password input is rendered
        const passwordInput = screen.getByPlaceholderText(/enter password here.../i);
        expect(passwordInput).toBeInTheDocument();

        // Optionally, simulate typing in the inputs
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Check if the inputs received the correct values
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });
});