import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Auth
import Login from './pages/auth/Login';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Core HR
import Employees from './pages/core/Employees';
import Documents from './pages/core/Documents';
import Assets from './pages/core/Assets';

// Performance
import Goals from './pages/performance/Goals';
import Appraisals from './pages/performance/Appraisals';
import Tracking from './pages/performance/Tracking';
import Actions from './pages/performance/Actions';

// ATS (Recruitment)
import Candidates from './pages/ats/Candidates';
import Interviews from './pages/ats/Interviews';
import Onboarding from './pages/ats/Onboarding';

// Payroll
import PayrollDashboard from './pages/payroll/PayrollDashboard';
import Expenses from './pages/payroll/Expenses';
import Benefits from './pages/payroll/Benefits';

// Culture
import CultureDashboard from './pages/culture/CultureDashboard';
import SocialFeed from './pages/culture/SocialFeed';

// Time & Attendance
import Attendance from './pages/time/Attendance';
import Leave from './pages/time/Leave';
import Shifts from './pages/time/Shifts';

// Learning
import Courses from './pages/learning/Courses';

// Analytics
import Reports from './pages/analytics/Reports';

// Settings
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Core HR */}
        <Route path="/core/employees" element={<Employees />} />
        <Route path="/core/documents" element={<Documents />} />
        <Route path="/core/assets" element={<Assets />} />

        {/* Performance */}
        <Route path="/performance/goals" element={<Goals />} />
        <Route path="/performance/reviews" element={<Navigate to="/performance/appraisals" replace />} />
        <Route path="/performance/appraisals" element={<Appraisals />} />
        <Route path="/performance/tracking" element={<Tracking />} />
        <Route path="/performance/actions" element={<Actions />} />

        {/* Recruitment (ATS) */}
        <Route path="/ats/candidates" element={<Candidates />} />
        <Route path="/ats/interviews" element={<Interviews />} />
        <Route path="/ats/onboarding" element={<Onboarding />} />

        {/* Payroll & Benefits */}
        <Route path="/payroll/dashboard" element={<PayrollDashboard />} />
        <Route path="/payroll/expenses" element={<Expenses />} />
        <Route path="/payroll/benefits" element={<Benefits />} />

        {/* Culture */}
        <Route path="/culture/dashboard" element={<CultureDashboard />} />
        <Route path="/culture/social" element={<SocialFeed />} />

        {/* Time & Attendance */}
        <Route path="/time/attendance" element={<Attendance />} />
        <Route path="/time/leave" element={<Leave />} />
        <Route path="/time/shifts" element={<Shifts />} />

        {/* Learning */}
        <Route path="/learning/courses" element={<Courses />} />

        {/* Analytics */}
        <Route path="/analytics/reports" element={<Reports />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
