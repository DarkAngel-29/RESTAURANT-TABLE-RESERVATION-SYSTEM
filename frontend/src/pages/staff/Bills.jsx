import { useState, useEffect } from 'react';
import { Search, Receipt, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const { data } = await api.get('/bill');
            setBills(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBills = bills.filter(b =>
        b.bill_no.toString().includes(searchTerm) ||
        (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        b.reservation_id.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">Bill Management</h2>
                    <p className="text-brand-muted">Track and manage generated bills and payments</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-brand-muted" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-brand-card"
                        placeholder="Search by ID, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-brand-card rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-bg border-b border-brand-border text-brand-muted text-sm tracking-wider uppercase">
                                <th className="px-6 py-4 font-semibold">Bill No</th>
                                <th className="px-6 py-4 font-semibold">Customer & Res.</th>
                                <th className="px-6 py-4 font-semibold">Total Amount</th>
                                <th className="px-6 py-4 font-semibold">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-12 text-brand-muted">Loading...</td></tr>
                            ) : filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-brand-muted">
                                        <Receipt className="mx-auto text-slate-300 mb-3" size={40} />
                                        No bills found matching your criteria
                                    </td>
                                </tr>
                            ) : filteredBills.map(bill => {
                                const isPaid = bill.payment_status === 'successful' || !!bill.payment_method;

                                return (
                                    <tr key={bill.bill_no} className="hover:bg-brand-bg/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-black text-brand-text">#{bill.bill_no}</span>
                                            <div className="text-xs text-brand-muted mt-1">{new Date(bill.date).toLocaleDateString()}</div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-brand-text font-medium">
                                                {bill.email || `Customer #${bill.customer_id}`}
                                            </div>
                                            <div className="text-xs text-brand-primary font-semibold flex items-center mt-1">
                                                Res #{bill.reservation_id}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-brand-text font-bold">
                                                ${parseFloat(bill.total_amount).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-brand-muted mt-1">
                                                Tax: ${parseFloat(bill.tax).toFixed(2)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isPaid ? (
                                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    <CheckCircle size={14} />
                                                    <span>Paid ({bill.payment_method || 'success'})</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                    <Clock size={14} />
                                                    <span>Pending</span>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bills;
