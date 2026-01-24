import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    HiOutlineOfficeBuilding,
    HiOutlineBell,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineCheckCircle,
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineDeviceMobile,
    HiOutlineDocumentReport
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useStore from '../../store/useStore';
import Badge from '../../components/common/Badge';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const { addToast } = useStore();

    const tabs = [
        { id: 'general', label: 'Company Profile', icon: HiOutlineOfficeBuilding },
        { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
        { id: 'security', label: 'Security', icon: HiOutlineShieldCheck },
        { id: 'billing', label: 'Billing', icon: HiOutlineCreditCard },
    ];

    const GeneralSettings = () => {
        const { control, handleSubmit } = useForm({
            defaultValues: {
                companyName: 'TechFlow Inc.',
                website: 'https://techflow.com',
                address: '123 Innovation Drive, Silicon Valley, CA 94025',
                email: 'admin@techflow.com',
                phone: '+1 (555) 123-4567'
            }
        });

        const onSubmit = (data) => {
            addToast('Company profile updated successfully', 'success');
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                        <Controller
                            name="companyName"
                            control={control}
                            render={({ field }) => (
                                <input {...field} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                        <Controller
                            name="website"
                            control={control}
                            render={({ field }) => (
                                <input {...field} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <textarea {...field} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <input {...field} type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <input {...field} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        );
    };

    const NotificationSettings = () => {
        const [settings, setSettings] = useState([
            { id: 1, title: 'Email Notifications', desc: 'Receive daily summaries and critical alerts via email', checked: true },
            { id: 2, title: 'Push Notifications', desc: 'Get real-time updates on your desktop', checked: false },
            { id: 3, title: 'Weekly Reports', desc: 'Receive weekly analytics reports', checked: true },
            { id: 4, title: 'Candidate Alerts', desc: 'Notify when a new candidate applies', checked: true },
            { id: 5, title: 'Leave Requests', desc: 'Notify when an employee requests leave', checked: true },
        ]);

        const toggleSetting = (id) => {
            setSettings(settings.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
            addToast('Notification preferences updated', 'success');
        };

        return (
            <div className="space-y-6 max-w-2xl">
                {settings.map((setting) => (
                    <div key={setting.id} className="flex items-start justify-between pb-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 p-3 rounded-lg transition-colors cursor-pointer" onClick={() => toggleSetting(setting.id)}>
                        <div>
                            <h4 className="font-medium text-slate-900">{setting.title}</h4>
                            <p className="text-sm text-slate-500">{setting.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                            <input type="checkbox" checked={setting.checked} readOnly className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        );
    };

    const SecuritySettings = () => (
        <div className="space-y-8 max-w-3xl">
            {/* Password Change */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                        <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                        <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => addToast('Password updated successfully', 'success')}>Update Password</Button>
                </div>
            </div>

            {/* 2FA */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full border border-slate-100 shadow-sm text-blue-600">
                            <HiOutlineDeviceMobile className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Authenticator App</p>
                            <p className="text-sm text-slate-500">Use an app like Google Authenticator to generate verification codes.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addToast('2FA setup initiated', 'info')}>Setup</Button>
                </div>
            </div>

            {/* Sessions */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">Active Sessions</h3>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">Windows 10 - Chrome</p>
                            <p className="text-xs text-slate-500">San Francisco, CA • Active now</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="xs" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => addToast('Session terminated', 'success')}>Sign out</Button>
                </div>
            </div>
        </div>
    );

    const BillingSettings = () => (
        <div className="space-y-8 max-w-3xl">
            {/* Current Plan */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">Pro Plan</Badge>
                            <span className="text-blue-100 text-sm">Valid until Dec 31, 2024</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">$49<span className="text-lg font-normal text-blue-200">/mo</span></h3>
                        <p className="text-blue-100">For growing teams up to 50 employees</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-lg font-medium transition">Change Plan</button>
                        <button className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition shadow-md">Upgrade to Enterprise</button>
                    </div>
                </div>
                {/* Decor elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Invoices */}
            <div>
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2 mb-4">Invoice History</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {[
                        { id: 'INV-2024-001', date: 'Jan 01, 2024', amount: '$49.00', status: 'Paid' },
                        { id: 'INV-2023-012', date: 'Dec 01, 2023', amount: '$49.00', status: 'Paid' },
                        { id: 'INV-2023-011', date: 'Nov 01, 2023', amount: '$49.00', status: 'Paid' }
                    ].map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <HiOutlineDocumentReport className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 text-sm">{invoice.id}</p>
                                    <p className="text-xs text-slate-500">{invoice.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-slate-900">{invoice.amount}</span>
                                <Badge variant="success" size="sm">{invoice.status}</Badge>
                                <Button variant="ghost" size="xs" onClick={() => addToast('Downloading invoice...', 'info')}>Download</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <Card className="p-2 space-y-1 sticky top-6">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </Card>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <Card className="min-h-[600px] border-none shadow-none bg-transparent sm:bg-white sm:border sm:shadow-sm sm:p-8">
                        <div className="block sm:hidden mb-6">
                            <h2 className="text-xl font-bold text-slate-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
                        </div>
                        {activeTab === 'general' && <GeneralSettings />}
                        {activeTab === 'notifications' && <NotificationSettings />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'billing' && <BillingSettings />}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
