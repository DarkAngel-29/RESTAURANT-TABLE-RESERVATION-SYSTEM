import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Edit, CheckCircle, ReceiptText } from 'lucide-react';
import api from '../../services/api';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resData, tableData] = await Promise.all([
                api.get('/staff/reservations'),
                api.get('/staff/tables')
            ]);
            setReservations(resData.data);
            setTables(tableData.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/reservations/${id}`, { status });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleAssignTable = async (id, tableId) => {
        if (!tableId) return;
        try {
            await api.put(`/reservations/${id}`, { table_id: tableId, status: 'confirmed' });
            fetchData();
        } catch (err) {
            alert("Failed to assign table");
        }
    };

    const handleAutoAssign = async (res) => {
        const available = tables.find(t => t.table_status === 'available' && t.seating_capacity >= res.no_of_guests);
        if (!available) {
            alert("No suitable table available for this party size.");
            return;
        }
        await handleAssignTable(res.reservation_id, available.table_id);
    };

    const handleGenerateBill = async (id, guests) => {
        try {
            await api.post('/bill/generate', { reservation_id: id, guests });
            alert("Bill generated successfully!");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to generate bill");
        }
    };

    const statusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-800',
            confirmed: 'bg-emerald-100 text-emerald-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">All Reservations</h2>
                    <p className="text-brand-muted">Manage customer bookings and assign tables</p>
                </div>
                <button onClick={fetchData} className="text-brand-primary font-semibold hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                    Refresh List
                </button>
            </div>

            <div className="bg-brand-card rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-brand-bg border-b border-brand-border text-brand-muted text-sm tracking-wider uppercase">
                                <th className="px-6 py-4 font-semibold">Res. ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">Guests</th>
                                <th className="px-6 py-4 font-semibold">Status & Table</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-12 text-brand-muted">Loading...</td></tr>
                            ) : reservations.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-12 text-brand-muted">No reservations found</td></tr>
                            ) : reservations.map(res => (
                                <tr key={res.reservation_id} className="hover:bg-brand-bg/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-brand-text">#{res.reservation_id}</td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-brand-text font-semibold flex items-center"><User size={14} className="mr-1 text-brand-muted" /> {res.email || 'Walk-in'}</span>
                                            <span className="text-xs text-brand-muted flex items-center mt-1"><Phone size={12} className="mr-1 text-brand-muted" />{res.phone || 'N/A'}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-brand-text font-medium flex items-center"><Calendar size={14} className="mr-1 text-brand-primary" /> {new Date(res.date).toLocaleDateString()}</span>
                                            <span className="text-xs text-brand-muted flex items-center mt-1"><Clock size={12} className="mr-1 text-brand-primary" />{res.time}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-brand-text font-semibold text-center">{res.no_of_guests}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col items-start gap-2">
                                            {statusBadge(res.status)}
                                            {res.table_id ? (
                                                <span className="text-xs font-medium text-brand-muted bg-brand-card px-2 py-1 rounded  ">Table #{res.table_id} (Cap: {res.seating_capacity})</span>
                                            ) : (
                                                <div className="flex gap-2 w-full">
                                                    <select
                                                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-brand-card focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50   w-full"
                                                        disabled={res.status === 'completed' || res.status === 'cancelled'}
                                                        onChange={(e) => handleAssignTable(res.reservation_id, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Assign Table...</option>
                                                        {tables.filter(t => t.table_status === 'available' && t.seating_capacity >= res.no_of_guests).map(t => (
                                                            <option key={t.table_id} value={t.table_id}>Table {t.table_id} ({t.seating_capacity} seats)</option>
                                                        ))}
                                                    </select>
                                                    {(res.status === 'pending' || res.status === 'confirmed') && (
                                                        <button onClick={() => handleAutoAssign(res)} className="text-xs bg-brand-button hover:bg-brand-primary text-brand-text px-2 py-1 rounded whitespace-nowrap   ">
                                                            Auto
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {res.status === 'pending' && (
                                                <button onClick={() => handleUpdateStatus(res.reservation_id, 'confirmed')} className="text-brand-primary hover:bg-emerald-50 p-2 rounded-lg transition" title="Confirm">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}

                                            {res.status === 'confirmed' && (
                                                <button onClick={() => handleGenerateBill(res.reservation_id, res.no_of_guests)} className="text-brand-primary hover:bg-indigo-50 p-2 rounded-lg transition" title="Generate Bill & Complete">
                                                    <ReceiptText size={18} />
                                                </button>
                                            )}

                                            {(res.status === 'pending' || res.status === 'confirmed') && (
                                                <button onClick={() => handleUpdateStatus(res.reservation_id, 'cancelled')} className="text-red-500 hover:bg-red-50 font-semibold px-3 py-1 rounded-lg transition text-xs border border-red-200 ml-2">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
