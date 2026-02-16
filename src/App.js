import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import VehiclePage from "./pages/VehiclePage/VehiclePage";

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            Car Showroom
          </Link>
          <p className="tagline">
            Premium vehicle gallery with curated selections and client reviews.
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
          <span>Car Showroom</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
