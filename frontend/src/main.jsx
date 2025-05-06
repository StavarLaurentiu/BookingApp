import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/theme.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AllRooms from "./components/AllRooms.jsx";
import BookingComponent from "./components/BookingComponent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <BookingComponent></BookingComponent>,
      },
      {
        path: "/all-rooms",
        element: <AllRooms></AllRooms>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
