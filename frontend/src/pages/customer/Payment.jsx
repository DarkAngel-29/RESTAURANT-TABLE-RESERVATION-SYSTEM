import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, ArrowLeft, Building, Wallet, CheckCircle, Receipt } from 'lucide-react';
import api from '../../services/api';

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [method, setMethod] = useState('card');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const { data } = await api.get(`/bill/by-id/${id}`);
                setBill(data);

                // Check if already paid
                const paymentRes = await api.get(`/payment/${id}`).catch(() => ({ data: [] }));
                if (paymentRes.data && paymentRes.data.length > 0) {
                    setSuccess(true);
                }
            } catch (err) {
                setError('Failed to fetch bill details');
            } finally {
                setLoading(false);
            }
        };
        fetchBill();
    }, [id]);

    const handlePayment = async () => {
        setSubmitting(true);
        setError('');

        try {
            await api.post('/payment', {
                bill_no: id,
                amount: bill.total_amount,
                payment_method: method
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/customer/bills', { replace: true });
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-12 text-center"><div className="animate-spin w-8 h-8 mx-auto border-4 border-brand-border border-t-indigo-600 rounded-full"></div></div>;

    if (error && !bill) return <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium m-8">{error}</div>;

    return (
        <div className="max-w-xl mx-auto py-8">
            <button
                onClick={() => navigate('/customer/bills')}
                className="flex items-center space-x-2 text-brand-muted hover:text-brand-primary font-medium mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Return to Bills</span>
            </button>

            {success ? (
                <div className="bg-brand-card p-10 rounded-2xl shadow-xl border border-emerald-100 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-emerald-100 text-brand-primary rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={50} />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-text mb-2">Payment Successful!</h2>
                    <p className="text-brand-muted mb-8 max-w-sm">Your payment of ${parseFloat(bill?.total_amount).toFixed(2)} for Bill #{id} has been processed.</p>
                    <div className="w-full h-1 bg-brand-card rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full animate-pulse transition-all duration-3000 ease-linear origin-left scale-x-0" style={{ animationFillMode: 'forwards' }}></div>
                    </div>
                    <p className="text-xs text-brand-muted mt-4">Redirecting...</p>
                </div>
            ) : (
                <div className="bg-brand-card rounded-2xl shadow-xl shadow-slate-200/50 border border-brand-border overflow-hidden">
                    <div className="bg-brand-sidebar text-brand-text p-8">
                        <h2 className="text-2xl font-bold flex items-center mb-1">
                            <Receipt className="mr-3 text-indigo-400" />
                            Complete Payment
                        </h2>
                        <p className="text-brand-muted text-sm">Review your bill and choose a payment method</p>
                    </div>

                    <div className="p-8">
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 mb-6">{error}</div>}

                        <div className="rounded-xl border border-brand-border bg-brand-bg p-6 mb-8">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-brand-border border-dashed">
                                <span className="text-brand-muted font-medium">Bill Number</span>
                                <span className="font-bold text-brand-text">#{id}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-brand-border border-dashed">
                                <span className="text-brand-muted font-medium">Reservation Date</span>
                                <span className="font-semibold text-brand-text">{new Date(bill.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-brand-border border-dashed">
                                <span className="text-brand-muted font-medium">Tax</span>
                                <span className="font-semibold text-brand-text">${parseFloat(bill.tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-brand-text font-bold text-lg">Total Amount</span>
                                <span className="text-brand-primary font-black text-3xl flex items-center">
                                    <DollarSign size={24} />
                                    {parseFloat(bill.total_amount).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h3 className="font-semibold text-brand-text">Payment Method</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div
                                    onClick={() => setMethod('card')}
                                    className={`cursor-pointer rounded-xl border flex flex-col items-center p-4 transition-all ${method === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20' : 'border-brand-border bg-brand-card text-brand-muted hover:border-indigo-300'}`}
                                >
                                    <CreditCard size={28} className="mb-2" />
                                    <span className="font-semibold text-sm">Card</span>
                                </div>
                                <div
                                    onClick={() => setMethod('cash')}
                                    className={`cursor-pointer rounded-xl border flex flex-col items-center p-4 transition-all ${method === 'cash' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20' : 'border-brand-border bg-brand-card text-brand-muted hover:border-emerald-300'}`}
                                >
                                    <DollarSign size={28} className="mb-2" />
                                    <span className="font-semibold text-sm">Cash</span>
                                </div>
                                <div
                                    onClick={() => setMethod('upi')}
                                    className={`cursor-pointer rounded-xl border flex flex-col items-center p-4 transition-all ${method === 'upi' ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-600/20' : 'border-brand-border bg-brand-card text-brand-muted hover:border-pink-300'}`}
                                >
                                    <Building size={28} className="mb-2" />
                                    <span className="font-semibold text-sm">UPI</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={submitting}
                            className={`w-full flex justify-center py-4 px-4 text-sm font-bold rounded-xl text-brand-text transition-all shadow-md mt-6 
                ${method === 'card' ? 'bg-brand-button hover:bg-brand-primary focus:ring-indigo-500 shadow-indigo-600/30' :
                                    method === 'cash' ? 'bg-brand-button hover:bg-brand-primary focus:ring-emerald-500 shadow-emerald-600/30' :
                                        'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 shadow-pink-600/30'} 
                ${submitting ? 'opacity-70 cursor-not-allowed transform scale-95' : 'hover:-translate-y-1'}`}
                        >
                            {submitting ? 'Processing Payment...' : `Pay $${parseFloat(bill.total_amount).toFixed(2)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
