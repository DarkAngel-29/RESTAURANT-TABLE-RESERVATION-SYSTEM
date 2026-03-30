import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar as CalendarIcon, Clock, Users, Coffee, Ban } from 'lucide-react';
import api from '../../services/api';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const { data } = await api.get('/reservations');
            setReservations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            await api.put(`/reservations/${id}`, { status: 'cancelled' });
            fetchReservations();
        } catch (err) {
            console.error(err);
            alert("Failed to cancel reservation");
        }
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        completed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">My Reservations</h2>
                    <p className="text-brand-muted">Manage and view your table bookings</p>
                </div>
                <Link
                    to="/customer/reservations/new"
                    className="flex items-center space-x-2 bg-brand-button hover:bg-brand-primary text-brand-text px-5 py-2.5 rounded-lg shadow-sm transition-colors font-medium"
                >
                    <PlusCircle size={20} />
                    <span>Book a Table</span>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-4 border-brand-border border-t-indigo-600 animate-spin"></div></div>
            ) : reservations.length === 0 ? (
                <div className="bg-brand-card rounded-2xl p-12 border border-brand-border shadow-sm text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center text-brand-muted mb-4">
                        <Coffee size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-text mb-2">No reservations yet</h3>
                    <p className="text-brand-muted max-w-sm mb-6">Looks like you haven't booked a table with us yet. Start your culinary journey today!</p>
                    <Link to="/customer/reservations/new" className="text-brand-primary font-semibold hover:text-indigo-700">Book your first table &rarr;</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations.map(res => (
                        <div key={res.reservation_id} className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="border-b border-brand-border p-5 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2 text-brand-text font-semibold text-lg mb-1">
                                        <CalendarIcon size={18} className="text-brand-primary" />
                                        <span>{new Date(res.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-brand-muted text-sm">
                                        <Clock size={16} />
                                        <span>{res.time}</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize shadow-sm ${statusColors[res.status]}`}>
                                    {res.status}
                                </span>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="flex items-center space-x-3 text-brand-text">
                                    <div className="w-8 h-8 rounded-full bg-brand-card flex items-center justify-center text-brand-muted">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-muted">Party Size</p>
                                        <p className="font-semibold">{res.no_of_guests} Guests</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-brand-border flex justify-end">
                                    {(res.status === 'pending' || res.status === 'confirmed') && (
                                        <button
                                            onClick={() => handleCancel(res.reservation_id)}
                                            className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-red-50"
                                        >
                                            <Ban size={16} />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reservations;
