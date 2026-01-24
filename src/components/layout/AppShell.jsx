import { Outlet, Navigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';
import { cn } from '../../utils/helpers';

const AppShell = () => {
    const { isAuthenticated, sidebarOpen } = useStore();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div
                className={cn(
                    'transition-all duration-300',
                    sidebarOpen ? 'lg:ml-64' : 'lg:ml-20',
                    'ml-0'
                )}
            >
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Toast Notifications */}
            <Toast />
        </div>
    );
};

export default AppShell;
