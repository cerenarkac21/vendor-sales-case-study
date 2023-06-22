import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useState } from "react";

// pages and components 
import Home from './pages/Home'
import Navbar from './components/Navbar';
import { SearchBar } from './components/VendorSearch';
import { SearchResultsList } from "./components/VendorSearchResultsList";
import ViewProducts from "./pages/ViewProducts";
import MonthlyAnalysis from './pages/MonthlyAnalysis';
import MonthlyGraph from './pages/MonthlyGraph';
function App() {
  const [results, setResults] = useState([]);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <div className = 'pages'>
          <Routes>
            <Route
              path="/"
              element={
                <div className="search-bar-container">
                  <Home/>
                  <SearchBar setResults={setResults} />
                  {results && results.length > 0 && <SearchResultsList results={results} />}
                </div>
              } 
            />
            <Route path="/vendor/:id/products" element={<ViewProducts />} />
            <Route path="/vendor/:id/products/monthly" element={<MonthlyAnalysis />} />
            <Route path="/vendor/:id/products/monthly/visualization" element={<MonthlyGraph />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
