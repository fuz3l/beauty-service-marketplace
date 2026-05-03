import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import RoleSelection from './pages/public/RoleSelection';
import AuthPage from './pages/auth/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/auth/:role" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
