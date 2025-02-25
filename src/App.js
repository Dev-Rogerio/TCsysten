import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Measure from "./Components/Pages/Measure/Measure.jsx";
import ModalMeasure from "./Components/Pages/Measure/Modal.Measure.jsx";
import NotFound from "./Components/Pages/NotFound/NotFound"; // Verifique se o caminho está correto

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Measure />} />
        <Route path="/measure" element={<ModalMeasure />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
