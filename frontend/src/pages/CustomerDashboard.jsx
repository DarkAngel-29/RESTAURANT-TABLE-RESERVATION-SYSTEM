import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, NotebookTabs, Grid2X2, Receipt, Menu, ChefHat } from 'lucide-react';

import Overview from './customer/Overview';
import Reservations from './customer/Reservations';
import CreateReservation from './customer/CreateReservation';
import Bills from './customer/Bills';
import Payment from './customer/Payment';
const CustomerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { path: '/customer', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/customer/reservations', icon: <NotebookTabs size={20} />, label: 'My Reservations' },
        { path: '/customer/bills', icon: <Receipt size={20} />, label: 'Bills & Payments' },
    ];

    return (
        <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
            {/* Sidebar mobile wrapper */}
            <div className={`fixed inset-0 bg-brand-card/50 z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-brand-sidebar text-slate-300 transform transition-transform duration-300 z-30 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl md:shadow-none`}>
                <div className="flex items-center justify-center h-20 border-b border-brand-border">
                    <ChefHat size={32} className="text-brand-primary mr-2" />
                    <h1 className="text-xl font-extrabold text-brand-text tracking-wider">Dinex</h1>
                </div>
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-brand-button text-brand-text shadow-md' : 'hover:bg-brand-card hover:text-brand-text'}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.icon}
                                <span className="font-medium text-sm w-full">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-brand-border bg-brand-sidebar">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-brand-muted hover:bg-brand-card hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-bg">
                <header className="h-20 bg-brand-card border-b border-brand-border flex items-center justify-between px-6 z-10">
                    <button
                        className="md:hidden text-brand-muted hover:text-brand-text focus:outline-none"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="font-bold text-xl text-brand-text hidden md:block tracking-tight ">
                        {menuItems.find(m => m.path === location.pathname)?.label || 'Customer Portal'}
                    </div>

                    <div className="flex items-center space-x-4">

                        <div className="flex flex-col items-end mr-3 hidden sm:flex">
                            <span className="text-sm font-semibold text-brand-text ">
                                {JSON.parse(localStorage.getItem('user'))?.name || 'Customer'}
                            </span>
                            <span className="text-xs text-brand-primary  font-medium">VIP Member</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-brand-text font-bold shadow-md ring-2 ring-white">
                            {(JSON.parse(localStorage.getItem('user'))?.name?.charAt(0) || 'C').toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/reservations/new" element={<CreateReservation />} />
                            <Route path="/bills" element={<Bills />} />
                            <Route path="/bills/:id/pay" element={<Payment />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
