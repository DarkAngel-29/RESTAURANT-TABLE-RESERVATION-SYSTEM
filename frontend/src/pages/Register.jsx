import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, Phone, LogIn, UserPlus } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', role: 'customer',
        booking_type: 'individual', age: '', id_proof: '',
        booking_person_name: '', booking_person_age: '', booking_person_id: '', number_of_members: 2
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-brand-bg">
            {/* Left side design block */}
            <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-rose-600 to-orange-500 text-brand-text p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                <ChefHat size={120} className="mb-8 z-10 drop-shadow-lg text-rose-100" />
                <h1 className="text-5xl font-extrabold tracking-tight mb-4 z-10 text-center">Join Us</h1>
                <p className="text-xl text-rose-100 max-w-md text-center z-10">
                    Create an account to quickly book tables, check history, and savor exclusivity.
                </p>
            </div>

            {/* Right side form */}
            <div className="flex-1 flex justify-center items-center p-8">
                <div className="w-full max-w-md space-y-8 bg-brand-card p-10 rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-brand-text tracking-tight">Create an Account</h2>
                        <p className="mt-2 text-sm text-brand-muted">Please fill in details to register</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg text-sm font-medium border border-red-900/50 text-center">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-brand-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm shadow-sm"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-brand-muted" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm shadow-sm"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-brand-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm shadow-sm"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-brand-muted" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm shadow-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 pt-2 border-b border-brand-border pb-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={formData.role === 'customer'}
                                        onChange={() => setFormData({ ...formData, role: 'customer' })}
                                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-brand-text font-medium">Customer</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="staff"
                                        checked={formData.role === 'staff'}
                                        onChange={() => setFormData({ ...formData, role: 'staff' })}
                                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-brand-text font-medium">Staff Account</span>
                                </label>
                            </div>

                            {formData.role === 'customer' && (
                                <div className="bg-brand-bg p-4 rounded-lg border border-brand-border space-y-4">
                                    <div className="flex space-x-4 mb-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="booking_type" value="individual" checked={formData.booking_type === 'individual'} onChange={() => setFormData({ ...formData, booking_type: 'individual' })} className="h-4 w-4 text-rose-600 focus:ring-rose-500" />
                                            <span className="ml-2 text-sm font-medium">Individual</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="booking_type" value="group" checked={formData.booking_type === 'group'} onChange={() => setFormData({ ...formData, booking_type: 'group' })} className="h-4 w-4 text-rose-600 focus:ring-rose-500" />
                                            <span className="ml-2 text-sm font-medium">Group</span>
                                        </label>
                                    </div>

                                    {formData.booking_type === 'individual' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-xs text-brand-muted">Age</label><input type="number" placeholder="Age" className="w-full border p-2 rounded text-sm bg-brand-card" onChange={e => setFormData({ ...formData, age: e.target.value })} /></div>
                                            <div><label className="text-xs text-brand-muted">ID Proof</label><input type="text" placeholder="ID Number" className="w-full border p-2 rounded text-sm bg-brand-card" onChange={e => setFormData({ ...formData, id_proof: e.target.value })} /></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div><label className="text-xs text-brand-muted">Booking Person Name</label><input type="text" placeholder="Name" className="w-full border p-2 rounded text-sm bg-brand-card" onChange={e => setFormData({ ...formData, booking_person_name: e.target.value })} /></div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div><label className="text-xs text-brand-muted">Age</label><input type="number" placeholder="Age" className="w-full border p-2 rounded text-sm bg-brand-card" onChange={e => setFormData({ ...formData, booking_person_age: e.target.value })} /></div>
                                                <div><label className="text-xs text-brand-muted">ID</label><input type="text" placeholder="ID" className="w-full border p-2 rounded text-sm bg-brand-card" onChange={e => setFormData({ ...formData, booking_person_id: e.target.value })} /></div>
                                                <div><label className="text-xs text-brand-muted">Members</label><input type="number" min="2" placeholder="Count" className="w-full border p-2 rounded text-sm bg-brand-card" value={formData.number_of_members} onChange={e => setFormData({ ...formData, number_of_members: parseInt(e.target.value) })} /></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-brand-text bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors shadow-md disabled:bg-rose-400 mt-6"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <UserPlus className="h-5 w-5 text-rose-300 group-hover:text-rose-200 transition-colors" />
                            </span>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-brand-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
