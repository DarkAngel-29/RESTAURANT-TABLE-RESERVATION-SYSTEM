import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const CreateReservation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        no_of_guests: 2
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Add simple validation
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError("Cannot book a date in the past");
            setLoading(false);
            return;
        }

        try {
            await api.post('/reservations', formData);
            navigate('/customer/reservations', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book table. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-brand-muted hover:text-brand-primary font-medium mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <div className="bg-brand-card p-8 md:p-12 rounded-2xl shadow-xl shadow-indigo-100/20 border border-brand-border">
                <h2 className="text-3xl font-bold text-brand-text mb-2">Reserve a Table</h2>
                <p className="text-brand-muted mb-8">Provide details about your dining plans and we'll handle the rest.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-6 flex items-center">
                        <span className="font-bold mr-2">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Date Picker */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-brand-text">Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="block w-full pl-10 pr-3 py-3 border border-brand-border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm bg-brand-bg hover:bg-brand-card transition-colors cursor-pointer"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Time Picker */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-brand-text">Time</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    type="time"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-brand-border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm bg-brand-bg hover:bg-brand-card transition-colors cursor-pointer"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Party Size */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-brand-text">Party Size (Number of guests)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-indigo-400" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-brand-border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm bg-brand-bg hover:bg-brand-card transition-colors"
                                value={formData.no_of_guests}
                                onChange={(e) => setFormData({ ...formData, no_of_guests: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-brand-text bg-brand-button hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md shadow-indigo-600/30 disabled:bg-indigo-400 disabled:shadow-none mt-8"
                    >
                        {loading ? 'Confirming Reservation...' : 'Complete Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateReservation;
