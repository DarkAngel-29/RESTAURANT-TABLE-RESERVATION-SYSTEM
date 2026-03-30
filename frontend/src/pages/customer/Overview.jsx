import { useState, useEffect } from 'react';
import { Calendar, CreditCard, Clock, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Overview = () => {
    const [stats, setStats] = useState({ upcoming: 0, totalBills: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [res, bills] = await Promise.all([
                    api.get('/reservations'),
                    api.get('/bill')
                ]);

                const upcoming = res.data.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
                setStats({ upcoming, totalBills: bills.data.length });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 animate-pulse flex space-x-4"><div className="rounded-full bg-brand-card h-10 w-10"></div><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-brand-card rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-brand-card rounded col-span-2"></div><div className="h-2 bg-brand-card rounded col-span-1"></div></div><div className="h-2 bg-brand-card rounded"></div></div></div></div>;

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-brand-text shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Utensils size={200} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Welcome to Dinex!</h2>
                    <p className="text-indigo-100 max-w-lg mb-6">Discover extraordinary culinary experiences. Book your next table and enjoy our world-class dining.</p>
                    <Link to="/customer/reservations/new" className="inline-block bg-brand-card text-brand-primary font-semibold px-6 py-3 rounded-xl hover:bg-brand-bg transition-colors shadow-sm">
                        Book a Table Now
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-card p-6 rounded-2xl shadow-sm border border-brand-border flex items-center space-x-4">
                    <div className="bg-indigo-100 p-4 rounded-xl text-brand-primary">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-muted">Upcoming Reservations</p>
                        <p className="text-2xl font-bold text-brand-text">{stats.upcoming}</p>
                    </div>
                </div>

                <div className="bg-brand-card p-6 rounded-2xl shadow-sm border border-brand-border flex items-center space-x-4">
                    <div className="bg-emerald-100 p-4 rounded-xl text-brand-primary">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-muted">Total Bills</p>
                        <p className="text-2xl font-bold text-brand-text">{stats.totalBills}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
