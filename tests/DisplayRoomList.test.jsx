// Mock useNavigate
import {describe} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {UserContext} from "../src/UserContext.jsx";
import {ChatRoomsContext} from "../src/ChatRoomsContext.jsx"
import DisplayRoomList from "../src/DisplayRoomList.jsx";

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),  // Mock useNavigate as a no-op function
        Link: ({ to, children }) => <a href={to}>{children}</a>, // Mock Link as a simple anchor
    };
});

global.EventSource = class EventSource {
    close() {
    }
}

describe('test DisplayRoomList.jsx', () => {
    it('calls createOneRoom when "create" button is clicked', () => {
        // Mock the logInFn and signUpFn
        const mockFn = vi.fn();

        render(
            <UserContext.Provider value={{ user: { email: "xx", uid: "12345" }, setUser: vi.fn() }}>
                <ChatRoomsContext.Provider value={{roomsHashTable: new Map(), setRoomsHashTable: vi.fn(), isLoading: false}}>
                    <DisplayRoomList createOneRoom = {mockFn}/>
                </ChatRoomsContext.Provider>
            </UserContext.Provider>
        );

        // Get the Sign Up button
        const createBt = screen.getByRole('button', { name: /create/i });
        expect(createBt).toBeInTheDocument();

        // Simulate the click event on Sign Up button
        fireEvent.click(createBt);

        // Check if signUpFn was called
        expect(mockFn).toHaveBeenCalledOnce();
    });

    it('should show one room', () => {
        const mockFn = vi.fn();
        render(
            <UserContext.Provider value={{ user: { email: "xx", uid: "12345" }, setUser: vi.fn() }}>
                <ChatRoomsContext.Provider value={{roomsHashTable: new Map(), setRoomsHashTable: vi.fn(), isLoading: false}}>
                    <DisplayRoomList createOneRoom = {mockFn} testRoom = {[{id: "1", name: "1", description: "1"}]}/>
                </ChatRoomsContext.Provider>
            </UserContext.Provider>
        );

        const roomLink = screen.getByRole('link', { name: /1 - 1 - 1/i });
        expect(roomLink).toBeInTheDocument();
    });

    it('text boxes are rendered correctly', () => {
        // Mock the logInFn and signUpFn
        const createOneRoom = vi.fn();

        render(
            <UserContext.Provider value={{ user: { id: "xx", email: "xx", uid: "12345" }, setUser: vi.fn() }}>
                <ChatRoomsContext.Provider value={{roomsHashTable: {}, setRoomsHashTable: vi.fn(), isLoading: false}}>
                    <DisplayRoomList />
                </ChatRoomsContext.Provider>
            </UserContext.Provider>
        );

        // Check if the email input is rendered
        const name = screen.getByPlaceholderText(/enter room name here.../i);
        expect(name).toBeInTheDocument();

        // Check if the password input is rendered
        const desc = screen.getByPlaceholderText(/enter description here.../i);
        expect(desc).toBeInTheDocument();

        // Optionally, simulate typing in the inputs
        fireEvent.change(name, { target: { value: 'room crazy' } });
        fireEvent.change(desc, { target: { value: 'crazy is the way' } });

        // Check if the inputs received the correct values
        expect(name.value).toBe('room crazy');
        expect(desc.value).toBe('crazy is the way');
    });
});