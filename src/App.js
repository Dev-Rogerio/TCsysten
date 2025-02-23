import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Measure from "./Components/Pages/Measure/Measure";
import ModalMeasure from "./Components/Pages/Measure/Modal.Measure";

// Definindo as rotas
const router = createBrowserRouter([
  {
    path: "/measure",
    element: <Measure />,
  },
  {
    path: "/modalmeasure",
    element: <ModalMeasure />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
