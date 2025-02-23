import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Measure from "./Components/Pages/Measure/Measure";
import NotFound from "./Components/Pages/NotFound/NotFound"; // Verifique se o caminho está correto

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Measure />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
