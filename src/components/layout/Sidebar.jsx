import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HiOutlineViewGrid,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineDesktopComputer,
    HiOutlineFlag,
    HiOutlineChartBar,
    HiOutlineClipboardCheck,
    HiOutlineLightningBolt,
    HiOutlineUserGroup,
    HiOutlineCalendar,
    HiOutlineUserCircle,
    HiOutlineHeart,
    HiOutlineChatAlt2,
    HiOutlineCurrencyDollar,
    HiOutlineReceiptTax,
    HiOutlineGift,
    HiOutlineClock,
    HiOutlineClipboardList,
    HiOutlineTemplate,
    HiOutlineAcademicCap,
    HiOutlinePresentationChartBar,
    HiOutlineCog,
    HiOutlineLogout,
    HiChevronDown,
    HiChevronLeft,
} from 'react-icons/hi';
import { cn } from '../../utils/helpers';
import useStore from '../../store/useStore';
import Avatar from '../common/Avatar';

const menuItems = [
    {
        title: 'Dashboard',
        icon: HiOutlineViewGrid,
        path: '/dashboard',
    },
    {
        title: 'Core HR',
        icon: HiOutlineUsers,
        children: [
            { title: 'Employees', path: '/core/employees', icon: HiOutlineUserCircle },
            { title: 'Documents', path: '/core/documents', icon: HiOutlineDocumentText },
            { title: 'Assets', path: '/core/assets', icon: HiOutlineDesktopComputer },
        ],
    },
    {
        title: 'Performance',
        icon: HiOutlineFlag,
        children: [
            { title: 'Goals', path: '/performance/goals', icon: HiOutlineFlag },
            { title: 'Tracking', path: '/performance/tracking', icon: HiOutlineChartBar },
            { title: 'Appraisals', path: '/performance/appraisals', icon: HiOutlineClipboardCheck },
            { title: 'Actions', path: '/performance/actions', icon: HiOutlineLightningBolt },
        ],
    },
    {
        title: 'Talent Acquisition',
        icon: HiOutlineUserGroup,
        children: [
            { title: 'Candidates', path: '/ats/candidates', icon: HiOutlineUserGroup },
            { title: 'Interviews', path: '/ats/interviews', icon: HiOutlineCalendar },
            { title: 'Onboarding', path: '/ats/onboarding', icon: HiOutlineClipboardList },
        ],
    },
    {
        title: 'Culture & Engagement',
        icon: HiOutlineHeart,
        children: [
            { title: 'Dashboard', path: '/culture/dashboard', icon: HiOutlineHeart },
            { title: 'Social Feed', path: '/culture/social', icon: HiOutlineChatAlt2 },
        ],
    },
    {
        title: 'Payroll & Benefits',
        icon: HiOutlineCurrencyDollar,
        children: [
            { title: 'Payroll', path: '/payroll/dashboard', icon: HiOutlineCurrencyDollar },
            { title: 'Expenses', path: '/payroll/expenses', icon: HiOutlineReceiptTax },
            { title: 'Benefits', path: '/payroll/benefits', icon: HiOutlineGift },
        ],
    },
    {
        title: 'Time & Attendance',
        icon: HiOutlineClock,
        children: [
            { title: 'Attendance', path: '/time/attendance', icon: HiOutlineClock },
            { title: 'Leave', path: '/time/leave', icon: HiOutlineCalendar },
            { title: 'Shifts', path: '/time/shifts', icon: HiOutlineTemplate },
        ],
    },
    {
        title: 'Learning',
        icon: HiOutlineAcademicCap,
        children: [
            { title: 'Courses', path: '/learning/courses', icon: HiOutlineAcademicCap },
        ],
    },
    {
        title: 'Analytics',
        icon: HiOutlinePresentationChartBar,
        children: [
            { title: 'Reports', path: '/analytics/reports', icon: HiOutlinePresentationChartBar },
        ],
    },
    {
        title: 'Settings',
        icon: HiOutlineCog,
        path: '/settings',
    },
];

const Sidebar = () => {
    const location = useLocation();
    const { sidebarOpen, toggleSidebar, user, logout } = useStore();
    const [expandedMenus, setExpandedMenus] = useState(['Core HR', 'Performance']);

    const toggleMenu = (title) => {
        setExpandedMenus((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const isChildActive = (children) => {
        return children?.some((child) => location.pathname === child.path);
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col',
                sidebarOpen ? 'w-64' : 'w-20'
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">H</span>
                    </div>
                    {sidebarOpen && (
                        <span className="text-lg font-bold text-slate-800">HRMS Pro</span>
                    )}
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <HiChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isExpanded = expandedMenus.includes(item.title);
                        const hasChildren = !!item.children;
                        const isActive = item.path === location.pathname || isChildActive(item.children);

                        return (
                            <li key={item.title}>
                                {hasChildren ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.title)}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            )}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            {sidebarOpen && (
                                                <>
                                                    <span className="flex-1 text-left">{item.title}</span>
                                                    <HiChevronDown
                                                        className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
                                                    />
                                                </>
                                            )}
                                        </button>

                                        {sidebarOpen && isExpanded && (
                                            <ul className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                                                {item.children.map((child) => {
                                                    const ChildIcon = child.icon;
                                                    const isChildActive = location.pathname === child.path;

                                                    return (
                                                        <li key={child.path}>
                                                            <NavLink
                                                                to={child.path}
                                                                className={cn(
                                                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                                                    isChildActive
                                                                        ? 'text-blue-600 bg-blue-50 font-medium'
                                                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                                                )}
                                                            >
                                                                <ChildIcon className="w-4 h-4" />
                                                                {child.title}
                                                            </NavLink>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <NavLink
                                        to={item.path}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                            location.pathname === item.path
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        )}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        {sidebarOpen && <span>{item.title}</span>}
                                    </NavLink>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-3 border-t border-slate-100">
                <div className={cn(
                    'flex items-center gap-3 p-3 rounded-lg bg-slate-50',
                    sidebarOpen ? '' : 'justify-center'
                )}>
                    <Avatar name={user?.name} size="sm" />
                    {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role || 'Administrator'}</p>
                        </div>
                    )}
                    {sidebarOpen && (
                        <button
                            onClick={logout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <HiOutlineLogout className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
