import { render, screen } from '@testing-library/react';
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

describe('SignInAndUp Component', () => {
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
});

// describe('SignInAndUp Component', () => {
//     it('renders Log In and Sign Up buttons', () => {
//         render(
//             <MemoryRouter>
//                 <UserContext.Provider value={{ user: null, setUser: () => {} }}>
//                     <SignInAndUp />
//                 </UserContext.Provider>
//             </MemoryRouter>
//         );
//
//         // Check if the "Log In" button is rendered
//         const logInButton = screen.getByRole('button', { name: /log in/i });
//         expect(logInButton).toBeInTheDocument();
//
//         // Check if the "Sign Up" button is rendered
//         const signUpButton = screen.getByRole('button', { name: /sign up/i });
//         expect(signUpButton).toBeInTheDocument();
//     });
// });
