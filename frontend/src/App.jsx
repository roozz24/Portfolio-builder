import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PortfolioView from "./pages/PortfolioView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/portfolio/:id" element={<PortfolioView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;