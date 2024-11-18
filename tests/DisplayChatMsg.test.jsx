// Mock useNavigate
import {describe} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {UserContext} from "../src/UserContext.jsx";
import {ChatRoomsContext} from "../src/ChatRoomsContext.jsx"
import DisplayChatMsg from "../src/DisplayChatMsg.jsx";
import {useParams} from "react-router-dom";

// const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),  // Mock useNavigate as a no-op function
        useParams: vi.fn(),
        Link: ({ to, children }) => <a href={to}>{children}</a>, // Mock Link as a simple anchor
    };
});

global.EventSource = class EventSource {
    close() {
    }
}

describe('test DisplayChatMsg.jsx', () => {
    it('display content when hashtable is empty || id not exist', () => {
        const mockUseParams = vi.mocked(useParams);
        mockUseParams.mockReturnValue({ roomId: "1" });

        render(
            <UserContext.Provider value={{ user: { email: "xx", uid: "12345" }, setUser: vi.fn() }}>
                <ChatRoomsContext.Provider value={{roomsHashTable: new Map(), setRoomsHashTable: vi.fn()}}>
                    <DisplayChatMsg />
                </ChatRoomsContext.Provider>
            </UserContext.Provider>
        );

        const text = screen.getByText(/Room .* Does Not Exist!/i);
        expect(text).toBeInTheDocument();
    });

    it('display one msg and test send msg feature', () => {
        // Mock the logInFn and signUpFn
        const mockFn = vi.fn();

        const mockUseParams = vi.mocked(useParams);
        mockUseParams.mockReturnValue({ roomId: "1" });

        const HashTable = new Map();
        HashTable.set("1", "test-name");

        render(
            <UserContext.Provider value={{ user: { email: "xx", uid: "12345" }, setUser: vi.fn() }}>
                <ChatRoomsContext.Provider value={{roomsHashTable: HashTable, setRoomsHashTable: vi.fn(), isLoading: false}}>
                    <DisplayChatMsg sendOneMsg = {mockFn} testMsg = {[{sender: "1", time: 1728635594250, content: "1", id: "xxx"}]}/>
                </ChatRoomsContext.Provider>
            </UserContext.Provider>
        );

        //10/11/2024, 1:33:14 AM

        // check if one msg is displayed
        const text = screen.getByText("1 @ 10/11/2024, 1:33:14 AM: 1");

        // Check if the email input is rendered
        const textInput = screen.getByPlaceholderText(/enter msg here.../i);
        expect(textInput).toBeInTheDocument();

        // Optionally, simulate typing in the inputs
        fireEvent.change(textInput, { target: { value: 'room crazy' } });

        // Check if the inputs received the correct values
        expect(textInput.value).toBe('room crazy');

        const sendBt = screen.getByRole('button', { name: /send/i });
        expect(sendBt).toBeInTheDocument();

        fireEvent.click(sendBt);

        expect(mockFn).toHaveBeenCalledOnce();
    });
});