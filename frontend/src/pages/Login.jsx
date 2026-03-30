import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, LogIn, Users, User, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('roleSelect'); // 'roleSelect' | 'loginForm'
    const [loginRole, setLoginRole] = useState(null); // 'customer' | 'staff'
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = (role) => {
        setLoginRole(role);
        setView('loginForm');
        setError('');
    };

    const handleBack = () => {
        setView('roleSelect');
        setLoginRole(null);
        setError('');
        setFormData({ email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { ...formData, role: loginRole });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'staff') {
                navigate('/staff');
            } else {
                navigate('/customer');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg px-4 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-4xl z-10 flex flex-col items-center">
                {/* Global Brand Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-brand-card p-4 rounded-2xl shadow-lg border border-brand-border/50 mb-4 inline-flex items-center justify-center">
                        <ChefHat size={48} className="text-brand-primary" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-brand-text">Dinex</h1>
                    <p className="mt-3 text-brand-muted text-lg text-center max-w-md">
                        The complete reservation and management platform
                    </p>
                </div>

                {view === 'roleSelect' ? (
                    <div className="w-full animation-fade-in flex flex-col items-center">
                        <h2 className="text-2xl font-semibold text-brand-text mb-8 text-center animate-fade-in-up">
                            Who is using the system?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-4">
                            {/* Customer Card */}
                            <button
                                onClick={() => handleRoleSelect('customer')}
                                className="group bg-brand-card border border-brand-border hover:border-brand-primary/50 p-10 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center justify-center text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="bg-brand-bg p-5 rounded-2xl mb-6 shadow-inner border border-brand-border/50 group-hover:scale-110 transition-transform duration-300">
                                    <User size={48} className="text-brand-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-text mb-2">Customer</h3>
                                <p className="text-brand-muted text-sm">
                                    Book tables and manage your upcoming reservations.
                                </p>
                            </button>

                            {/* Employee Card */}
                            <button
                                onClick={() => handleRoleSelect('staff')}
                                className="group bg-brand-card border border-brand-border hover:border-brand-primary/50 p-10 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center justify-center text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="bg-brand-bg p-5 rounded-2xl mb-6 shadow-inner border border-brand-border/50 group-hover:scale-110 transition-transform duration-300">
                                    <Users size={48} className="text-brand-button" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-text mb-2">Employee</h3>
                                <p className="text-brand-muted text-sm">
                                    Access the staff portal to manage tables and billing.
                                </p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md animation-fade-in animate-fade-in-up">
                        <div className="bg-brand-card border border-brand-border p-8 rounded-3xl shadow-2xl relative">
                            {/* Back Button */}
                            <button
                                onClick={handleBack}
                                className="absolute top-6 left-6 text-brand-muted hover:text-brand-text transition-colors flex items-center space-x-2 text-sm font-medium"
                            >
                                <ArrowLeft size={16} />
                                <span>Back</span>
                            </button>

                            <div className="text-center mt-6 mb-8">
                                <div className="inline-flex items-center justify-center p-3 bg-brand-bg rounded-xl mb-4 border border-brand-border/50 shadow-inner">
                                    {loginRole === 'customer' ? <User size={24} className="text-brand-primary" /> : <Users size={24} className="text-brand-button" />}
                                </div>
                                <h2 className="text-2xl font-bold text-brand-text tracking-tight capitalize">
                                    {loginRole} Login
                                </h2>
                                <p className="mt-2 text-sm text-brand-muted">
                                    Sign in to your {loginRole} account
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-900/20 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-900/50 text-center mb-6 shadow-inner">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text mb-1.5 ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-brand-muted" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                className="block w-full pl-11 pr-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-brand-text placeholder-brand-muted transition-all shadow-inner"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-brand-text mb-1.5 ml-1">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-brand-muted" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                className="block w-full pl-11 pr-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-brand-text placeholder-brand-muted transition-all shadow-inner"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-button hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary transition-all shadow-lg hover:shadow-brand-primary/25 disabled:bg-brand-muted disabled:cursor-not-allowed mt-2"
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                                        <LogIn className="h-5 w-5 text-white/50 group-hover:text-white/80 transition-colors" />
                                    </span>
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>

                            {loginRole === 'customer' && (
                                <p className="mt-8 text-center text-sm text-brand-muted">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-semibold text-brand-primary hover:text-brand-text transition-colors">
                                        Create one now
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Simple CSS animation injected for the fade effects */}
            <style>{`
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
}
`}</style>
        </div>
    );
};

export default Login;
