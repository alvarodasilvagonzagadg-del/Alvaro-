/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FlixEarnProvider, useFlixEarnContext } from './context/FlixEarnContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { MoviesCatalog } from './pages/MoviesCatalog';
import { Login } from './pages/Login';
import { Player } from './pages/Player';
import { Withdraw } from './pages/Withdraw';
import { Plans } from './pages/Plans';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminMovies } from './pages/admin/Movies';
import { AdminWithdrawals } from './pages/admin/Withdrawals';
import { AdminCashier } from './pages/admin/Cashier';
import { AdminPlans } from './pages/admin/Plans';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { state } = useFlixEarnContext();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!state.currentUser) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#E50914] selection:text-white">
      <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pt-20 transition-all duration-300">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { state } = useFlixEarnContext();
  if (!state.currentUser?.isAdmin) return <Navigate to="/" />;
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <FlixEarnProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/movies" element={<AppLayout><MoviesCatalog /></AppLayout>} />
          <Route path="/player/:id" element={<AppLayout><Player /></AppLayout>} />
          <Route path="/withdraw" element={<AppLayout><Withdraw /></AppLayout>} />
          <Route path="/plans" element={<AppLayout><Plans /></AppLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/movies" element={<AdminLayout><AdminMovies /></AdminLayout>} />
          <Route path="/admin/withdrawals" element={<AdminLayout><AdminWithdrawals /></AdminLayout>} />
          <Route path="/admin/cashier" element={<AdminLayout><AdminCashier /></AdminLayout>} />
          <Route path="/admin/plans" element={<AdminLayout><AdminPlans /></AdminLayout>} />
        </Routes>
      </Router>
    </FlixEarnProvider>
  );
}
