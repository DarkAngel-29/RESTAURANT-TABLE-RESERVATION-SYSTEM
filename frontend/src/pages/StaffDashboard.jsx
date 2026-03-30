import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, ClipboardList, Utensils, ReceiptText, Menu, ChefHat } from 'lucide-react';

import Overview from './staff/Overview';
import Reservations from './staff/Reservations';
import Tables from './staff/Tables';
import Bills from './staff/Bills';
const StaffDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { path: '/staff', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/staff/reservations', icon: <ClipboardList size={20} />, label: 'Reservations' },
        { path: '/staff/tables', icon: <Utensils size={20} />, label: 'Table Setup' },
        { path: '/staff/bills', icon: <ReceiptText size={20} />, label: 'Bills & Payments' },
    ];

    return (
        <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
            {/* Sidebar mobile wrapper */}
            <div className={`fixed inset-0 bg-brand-card/50 z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-brand-sidebar text-slate-300 transform transition-transform duration-300 z-30 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl md:shadow-none`}>
                <div className="flex items-center justify-center h-20 border-b border-brand-border">
                    <ChefHat size={32} className="text-brand-primary mr-2" />
                    <h1 className="text-xl font-extrabold text-brand-text tracking-wider">Staff Portal</h1>
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
                        {menuItems.find(m => m.path === location.pathname)?.label || 'Staff Management'}
                    </div>

                    <div className="flex items-center space-x-4">

                        <div className="flex flex-col items-end mr-3 hidden sm:flex">
                            <span className="text-sm font-semibold text-brand-text ">
                                {JSON.parse(localStorage.getItem('user'))?.name || 'Staff User'}
                            </span>
                            <span className="text-xs text-brand-primary  font-medium">Administrator</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-brand-text font-bold shadow-md ring-2 ring-white">
                            {(JSON.parse(localStorage.getItem('user'))?.name?.charAt(0) || 'S').toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/tables" element={<Tables />} />
                            <Route path="/bills" element={<Bills />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffDashboard;
