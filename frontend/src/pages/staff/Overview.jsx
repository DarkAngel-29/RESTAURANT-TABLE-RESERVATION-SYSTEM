import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Utensils, ClipboardList, DollarSign } from 'lucide-react';
import api from '../../services/api';

const Overview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalReservations: 0,
        availableTables: 0,
        todayBills: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const { data } = await api.get('/staff/stats');
                setStats({
                    totalReservations: Number(data.today_bookings) || 0,
                    availableTables: Number(data.available_tables) || 0,
                    todayBills: Number(data.bills_generated) || 0,
                    revenue: parseFloat(data.total_revenue) || 0
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) return <div className="p-12 text-center"><div className="animate-spin w-8 h-8 mx-auto border-4 border-brand-border border-t-emerald-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-brand-text">Hello, {JSON.parse(localStorage.getItem('user'))?.name || 'Staff'}!</h2>
                <p className="text-brand-muted">Here's what's happening at the restaurant today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-sm flex items-center space-x-4">
                    <div className="bg-emerald-100 p-4 rounded-xl text-brand-primary">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-muted">Today's Bookings</p>
                        <p className="text-2xl font-bold text-brand-text">{stats.totalReservations}</p>
                    </div>
                </div>

                <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-sm flex items-center space-x-4">
                    <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                        <Utensils size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-muted">Available Tables</p>
                        <p className="text-2xl font-bold text-brand-text">{stats.availableTables}</p>
                    </div>
                </div>

                <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-sm flex items-center space-x-4">
                    <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-muted">Bills Generated</p>
                        <p className="text-2xl font-bold text-brand-text">{stats.todayBills}</p>
                    </div>
                </div>

                <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-sm flex items-center space-x-4">
                    <div className="bg-indigo-100 p-4 rounded-xl text-brand-primary">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-muted">Total Revenue</p>
                        <p className="text-2xl font-bold text-brand-text">${(stats.revenue || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Additional dashboard widgets can go here (e.g. recent activity) */}
            <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-sm mt-8">
                <h3 className="font-bold text-brand-text mb-4 flex items-center">
                    <Utensils className="mr-2 text-brand-primary" size={20} />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/staff/reservations')} className="p-4 border border-brand-border rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-brand-text transition font-medium text-sm">
                        Walk-in Customer
                    </button>
                    <button onClick={() => navigate('/staff/reservations')} className="p-4 border border-brand-border rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-brand-text transition font-medium text-sm">
                        Assign Table
                    </button>
                    <button onClick={() => navigate('/staff/reservations')} className="p-4 border border-brand-border rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-brand-text transition font-medium text-sm">
                        Generate Bill
                    </button>
                    <button onClick={() => navigate('/staff/tables')} className="p-4 border border-brand-border rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-brand-text transition font-medium text-sm">
                        Manage Tables
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
