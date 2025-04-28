import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Login from './components/Login';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    
    <div className="app">
          <AuthProvider>      
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path = "/auth" element={<Login/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<div>Test Page</div>} />
          <Route path="/tours" element={<Tours />} />
        </Routes>
      </main></AuthProvider>

    </div>
  );
}

export default App;