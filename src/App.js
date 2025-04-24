import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Tours from './pages/Tours';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<div>Test Page</div>} />
          <Route path="/tours" element={<Tours />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;