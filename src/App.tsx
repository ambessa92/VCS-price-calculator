import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PriceCalculatorPage } from './components/PriceCalculatorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<PriceCalculatorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
