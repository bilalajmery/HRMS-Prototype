import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';

// Validation schema
const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

const Login = () => {
    const navigate = useNavigate();
    const { login, addToast } = useStore();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    // Load saved email on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('hrms_email');
        if (savedEmail) {
            setValue('email', savedEmail);
            setValue('rememberMe', true);
        }
    }, [setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const success = login(data.email, data.password);

        if (success) {
            if (data.rememberMe) {
                localStorage.setItem('hrms_email', data.email);
            } else {
                localStorage.removeItem('hrms_email');
            }
            addToast('Welcome back! Login successful.', 'success');
            navigate('/dashboard');
        } else {
            addToast('Invalid credentials. Please try again.', 'error');
        }
        setLoading(false);
    };

    const fillDemoCredentials = () => {
        setValue('email', 'admin@company.com');
        setValue('password', 'password123');
    };

    return (
        <>
            <SEO
                title="Sign In"
                description="Sign in to your HRMS Pro account to manage your human resources, performance, and payroll."
            />
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="w-full max-w-md p-6 relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg mb-6">
                            <span className="text-3xl font-bold">H</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Sign in to your HRMS Pro account</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${errors.email ? 'border-red-300 ring-red-100' : 'border-slate-200'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${errors.password ? 'border-red-300 ring-red-100' : 'border-slate-200'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register('rememberMe')}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Forgot password?</a>
                            </div>

                            <Button type="submit" className="w-full py-3 text-base shadow-lg shadow-blue-500/20" loading={loading}>
                                Sign In
                            </Button>

                            <button
                                type="button"
                                onClick={fillDemoCredentials}
                                className="w-full py-3 text-sm font-medium text-slate-600 bg-white border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 transition-all"
                            >
                                Use Demo Credentials (Admin)
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account? <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">Create an account</a>
                    </p>
                    <div className="mt-8 text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} HRMS Pro. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
