import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import RoleSelection from './pages/public/RoleSelection';
import AuthPage from './pages/auth/AuthPage';
import ArtistDashboard from './pages/dashboard/ArtistDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import Browse from './pages/public/Browse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/auth/:role" element={<AuthPage />} />
        <Route path="/artist/dashboard" element={<ArtistDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
