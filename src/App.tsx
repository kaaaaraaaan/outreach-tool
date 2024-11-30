import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Clients from './pages/Clients';
import OutreachSites from './pages/OutreachSites';
import LinksMapping from './pages/LinksMapping';
import Agencies from './pages/Agencies';
import Database from './pages/Database';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/clients" replace />} />
          <Route path="clients" element={<Clients />} />
          <Route path="outreach-sites" element={<OutreachSites />} />
          <Route path="links" element={<LinksMapping />} />
          <Route path="agencies" element={<Agencies />} />
          <Route path="database" element={<Database />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;