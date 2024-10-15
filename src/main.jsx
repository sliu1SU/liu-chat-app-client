import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {UserProvider} from "./UserContext.jsx";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./NotFoundPage.jsx";
import {ChatRoomsProvider} from "./ChatRoomsContext.jsx";
import RoomListContainer from "./RoomListContainer.jsx";
import MsgListContainer from "./MsgListContainer.jsx";

// define all urls
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />
    },
    {
        path: "/rooms",
        element: <RoomListContainer />
    },
    {
        path: "/rooms/:roomId",
        element: <MsgListContainer />
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
      <UserProvider>  {/* Wrap App with UserProvider */}
          <ChatRoomsProvider>
              <RouterProvider router={router} />
          </ChatRoomsProvider>
      </UserProvider>
  </StrictMode>,
)
