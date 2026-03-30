import { useState, useEffect } from 'react';
import { Utensils, Users, PlusCircle, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import api from '../../services/api';

const Tables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create / Edit states
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ seating_capacity: 2, table_status: 'available' });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/staff/tables');
            setTables(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/tables', formData);
            setIsAdding(false);
            fetchTables();
        } catch (err) {
            alert("Failed to create table");
        }
    };

    const handleUpdate = async (id, payload) => {
        try {
            await api.put(`/tables/${id}`, payload || formData);
            setEditingId(null);
            fetchTables();
        } catch (err) {
            alert("Failed to update table");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'available' ? 'reserved' :
            currentStatus === 'reserved' ? 'occupied' : 'available';
        await handleUpdate(id, { table_status: nextStatus });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            await api.delete(`/tables/${id}`);
            fetchTables();
        } catch (err) {
            alert("Failed to delete table");
        }
    };

    const beginEdit = (t) => {
        setEditingId(t.table_id);
        setFormData({ seating_capacity: t.seating_capacity, table_status: t.table_status });
    };

    const statusColors = {
        available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        reserved: 'bg-amber-100 text-amber-800 border-amber-200',
        occupied: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">Table Setup</h2>
                    <p className="text-brand-muted">Configure restaurant floor and adjust statuses</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setFormData({ seating_capacity: 2, table_status: 'available' }); }}
                    className="flex items-center space-x-2 bg-brand-sidebar hover:bg-brand-card text-brand-text px-5 py-2.5 rounded-lg shadow-sm transition-colors font-medium"
                >
                    <PlusCircle size={20} />
                    <span>Add New Table</span>
                </button>
            </div>

            {isAdding && (
                <div className="bg-brand-bg border border-brand-border p-6 rounded-2xl flex flex-col sm:flex-row items-end gap-4 shadow-sm">
                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-semibold text-brand-text mb-2">Seating Capacity</label>
                        <input
                            type="number" min="1" max="20"
                            className="w-full border border-slate-300 rounded-lg p-3 bg-brand-card focus:ring-emerald-500 focus:border-emerald-500"
                            value={formData.seating_capacity}
                            onChange={(e) => setFormData({ ...formData, seating_capacity: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-semibold text-brand-text mb-2">Initial Status</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg p-3 bg-brand-card focus:ring-emerald-500 focus:border-emerald-500"
                            value={formData.table_status}
                            onChange={(e) => setFormData({ ...formData, table_status: e.target.value })}
                        >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="occupied">Occupied</option>
                        </select>
                    </div>
                    <div className="flex gap-2 w-full sm:w-1/3">
                        <button onClick={handleCreate} className="flex-1 bg-brand-button text-brand-text p-3 rounded-lg hover:bg-brand-primary font-semibold transition-colors">Save</button>
                        <button onClick={() => setIsAdding(false)} className="flex-1 border border-slate-300 text-brand-muted p-3 rounded-lg hover:bg-brand-card font-semibold transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-muted" size={40} /></div>
            ) : tables.length === 0 ? (
                <div className="text-center p-12 bg-brand-card rounded-2xl border border-brand-border">
                    <Utensils className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-brand-text mb-2">No Tables Configured</h3>
                    <p className="text-brand-muted">Add tables to start managing reservations</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {tables.map(t => (
                        <div key={t.table_id} className={`rounded-xl border shadow-sm p-5 relative transition-all ${t.table_status === 'available' ? 'border-emerald-200 bg-emerald-50/30' : t.table_status === 'reserved' ? 'border-amber-200 bg-amber-50/30' : 'border-indigo-200 bg-indigo-50/30'}`}>

                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${statusColors[t.table_status]}`}>
                                    {t.table_status}
                                </span>

                                <div className="flex gap-1">
                                    <button onClick={() => beginEdit(t)} className="text-brand-muted hover:text-brand-primary transition" title="Edit Capacity">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(t.table_id)} className="text-brand-muted hover:text-red-600 transition" title="Delete Table">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {editingId === t.table_id ? (
                                <div className="flex flex-col gap-2">
                                    <input type="number" className="border rounded px-2 p-1 text-sm w-full" value={formData.seating_capacity} onChange={(e) => setFormData({ ...formData, seating_capacity: parseInt(e.target.value) })} />
                                    <div className="flex gap-1">
                                        <button onClick={() => handleUpdate(t.table_id)} className="flex-1 bg-brand-button text-brand-text text-xs py-1 rounded">Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 bg-brand-card text-brand-text text-xs py-1 rounded">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center pb-4">
                                    <h3 className="text-4xl font-black text-brand-text mb-2">#{t.table_id}</h3>
                                    <div className="flex justify-center items-center text-brand-muted font-medium">
                                        <Users size={16} className="mr-1" />
                                        {t.seating_capacity} Seats
                                    </div>

                                    <button
                                        onClick={() => handleToggleStatus(t.table_id, t.table_status)}
                                        className="mt-6 w-full py-2 bg-brand-card border border-brand-border text-brand-text font-semibold text-xs rounded-lg shadow-sm hover:shadow transition"
                                    >
                                        Quick Toggle Status
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tables;
