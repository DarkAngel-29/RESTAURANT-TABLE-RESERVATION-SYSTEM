import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, CheckCircle, Clock, CreditCard } from 'lucide-react';
import api from '../../services/api';

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;

            const user = JSON.parse(userStr);
            const { data } = await api.get(`/bill/customer/${user.id}`);

            // Map the data to fit the UI table
            setBills(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">My Bills</h2>
                    <p className="text-brand-muted">View and manage your dining receipts and payments</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-4 border-brand-border border-t-indigo-600 animate-spin"></div></div>
            ) : bills.length === 0 ? (
                <div className="bg-brand-card rounded-2xl p-12 border border-brand-border shadow-sm text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center text-brand-muted mb-4">
                        <Receipt size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-text mb-2">No bills history</h3>
                    <p className="text-brand-muted max-w-sm mb-6">Looks like you don't have any generated bills yet. Visit us and enjoy a meal!</p>
                </div>
            ) : (
                <div className="bg-brand-card rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-bg border-b border-brand-border text-brand-muted text-sm tracking-wider uppercase">
                                    <th className="px-6 py-4 font-semibold">Bill No</th>
                                    <th className="px-6 py-4 font-semibold">Reservation ID</th>
                                    <th className="px-6 py-4 font-semibold text-center">Guests</th>
                                    <th className="px-6 py-4 font-semibold">Tax</th>
                                    <th className="px-6 py-4 font-semibold">Total Amount</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bills.map(bill => {
                                    const isPaid = bill.payment_status === 'successful';

                                    return (
                                        <tr key={bill.bill_no} className="hover:bg-brand-bg/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-brand-primary font-bold">
                                                        #{bill.bill_no}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-brand-text font-medium">
                                                    #{bill.reservation_id}
                                                </div>
                                                <div className="text-xs text-brand-muted mt-1">
                                                    {new Date(bill.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-brand-text font-medium">
                                                {bill.no_of_guests}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-brand-muted">
                                                ${parseFloat(bill.tax).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-brand-text font-bold">
                                                    ${parseFloat(bill.total_amount).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {isPaid ? (
                                                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        <CheckCircle size={14} />
                                                        <span>Paid</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <Clock size={14} />
                                                        <span>Unpaid</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {!isPaid ? (
                                                    <Link
                                                        to={`/customer/bills/${bill.bill_no}/pay`}
                                                        className="inline-flex items-center space-x-2 text-brand-primary hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors font-semibold"
                                                    >
                                                        <CreditCard size={16} />
                                                        <span>Pay Now</span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-brand-muted font-medium italic">Settled</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bills;
