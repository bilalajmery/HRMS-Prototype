import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiOutlineMenu,
    HiOutlineSearch,
    HiOutlineBell,
    HiOutlineQuestionMarkCircle,
    HiOutlineUser,
    HiOutlineCog,
    HiOutlineLogout,
} from 'react-icons/hi';
import { cn } from '../../utils/helpers';
import useStore from '../../store/useStore';
import Avatar from '../common/Avatar';

const Header = () => {
    const navigate = useNavigate();
    const { toggleSidebar, user, notifications, markAllNotificationsRead, logout } = useStore();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results or filter current page
            console.log('Search for:', searchQuery);
            setSearchOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center">
            <div className="flex items-center justify-between w-full px-4 lg:px-6">
                {/* Left: Menu Toggle & Search */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <HiOutlineMenu className="w-6 h-6" />
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center relative">
                        <HiOutlineSearch className="absolute left-3 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search employees, documents..."
                            className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Mobile Search Button */}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <HiOutlineSearch className="w-6 h-6" />
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Help */}
                    <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <HiOutlineQuestionMarkCircle className="w-6 h-6" />
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <HiOutlineBell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllNotificationsRead}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="px-4 py-8 text-center text-sm text-slate-500">
                                            No notifications
                                        </p>
                                    ) : (
                                        notifications.slice(0, 5).map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={cn(
                                                    'px-4 py-3 hover:bg-slate-50 cursor-pointer border-l-2 transition-colors',
                                                    notif.read ? 'border-transparent' : 'border-blue-500 bg-blue-50/50'
                                                )}
                                            >
                                                <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-4 py-2 border-t border-slate-100">
                                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Avatar name={user?.name} size="sm" />
                        </button>

                        {/* Profile Dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="font-semibold text-slate-800">{user?.name || 'Admin User'}</p>
                                    <p className="text-sm text-slate-500">{user?.email || 'admin@company.com'}</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        <HiOutlineUser className="w-5 h-5" />
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        <HiOutlineCog className="w-5 h-5" />
                                        Settings
                                    </button>
                                </div>
                                <div className="py-1 border-t border-slate-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <HiOutlineLogout className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {searchOpen && (
                <div className="absolute top-full left-0 right-0 p-4 bg-white border-b border-slate-200 md:hidden animate-fade-in">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
};

export default Header;
