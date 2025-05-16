import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Login from './components/Login';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import AdminPanel from './pages/admin';
import AdminLogin from './pages/admin/login';
import Ticket from './pages/Ticket';
import BookingConfirmation from './pages/BookingConfirmation';
import Support from './pages/Support';
import ProfileTickets from './pages/ProfileTickets';
import TicketDetails from './pages/TicketDetails';
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
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/ticket/:routeId" element={<Ticket />} />
          <Route path="/ticketDetails/:id" element={<TicketDetails />} />
          <Route path="/booking-confirmation/:ticketId" element={<BookingConfirmation />} />
          <Route path="/test" element={<div>Test Page</div>} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profileTickets" element={<ProfileTickets />} />
        </Routes>
      </main></AuthProvider>

    </div>
  );
}

export default App;