import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import VehiclePage from "./pages/VehiclePage";

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            Car Showroom
          </Link>
          <p className="tagline">
            Virtual showroom for exploring vehicles and sharing opinions.
          </p>
        </div>
      </header>

      <main className="container main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles/:vehicleId" element={<VehiclePage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>DummyJSON Vehicles Showcase</span>
          <span>Built with React + localStorage</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
