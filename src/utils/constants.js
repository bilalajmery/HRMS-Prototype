// Constants for the HRMS application

export const DEPARTMENTS = [
    'Engineering',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'Design',
    'Support',
    'Operations',
    'Legal',
    'Product'
];

export const EMPLOYEE_STATUSES = [
    'Active',
    'Inactive',
    'Probation',
    'On Leave'
];

export const DOCUMENT_TYPES = [
    'Contract',
    'ID Proof',
    'Visa',
    'Certification',
    'Policy',
    'Other'
];

export const ASSET_TYPES = [
    'Laptop',
    'Phone',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Headset',
    'Other'
];

export const ASSET_STATUSES = [
    'Available',
    'Assigned',
    'Maintenance',
    'Retired'
];

export const GOAL_CATEGORIES = [
    'Individual',
    'Team',
    'Company OKR'
];

export const GOAL_STATUSES = [
    'In Progress',
    'Completed',
    'Overdue'
];

export const CANDIDATE_STAGES = [
    'Applied',
    'Screening',
    'Interview',
    'Offer',
    'Hired',
    'Rejected'
];

export const CANDIDATE_SOURCES = [
    'LinkedIn',
    'Website',
    'Referral',
    'Indeed',
    'Glassdoor',
    'Agency',
    'Other'
];

export const INTERVIEW_TYPES = [
    'Phone',
    'Video',
    'On-site'
];

export const LEAVE_TYPES = [
    'Annual',
    'Sick',
    'Personal',
    'Maternity',
    'Paternity',
    'Unpaid'
];

export const EXPENSE_TYPES = [
    'Travel',
    'Meals',
    'Equipment',
    'Office Supplies',
    'Software',
    'Training',
    'Other'
];

export const EXPENSE_STATUSES = [
    'Pending',
    'Approved',
    'Rejected'
];

export const COURSE_LEVELS = [
    'Beginner',
    'Intermediate',
    'Advanced'
];

export const COURSE_CATEGORIES = [
    'Technical',
    'Leadership',
    'Soft Skills',
    'Management',
    'Compliance',
    'Product'
];

// Status colors for badges
export const STATUS_COLORS = {
    // Employee statuses
    'Active': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Inactive': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
    'Probation': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'On Leave': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },

    // Document statuses
    'Expiring': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Expired': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },

    // Asset statuses
    'Available': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Assigned': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Maintenance': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Retired': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },

    // Goal statuses
    'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Completed': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Overdue': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },

    // Candidate stages
    'Applied': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
    'Screening': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Interview': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Offer': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
    'Hired': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Rejected': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },

    // Expense/Leave statuses
    'Pending': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Approved': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },

    // Interview statuses
    'Scheduled': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },

    // Generic
    'default': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' }
};

// Chart colors
export const CHART_COLORS = {
    primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    secondary: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    accent: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    departments: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316'],
    status: {
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
    }
};

// Type icons
export const TYPE_ICONS = {
    document: {
        'Contract': '📑',
        'ID Proof': '🪪',
        'Visa': '🛂',
        'Certification': '🎓',
        'Policy': '📋',
        'Other': '📄'
    },
    asset: {
        'Laptop': '💻',
        'Phone': '📱',
        'Monitor': '🖥️',
        'Keyboard': '⌨️',
        'Mouse': '🖱️',
        'Headset': '🎧',
        'Other': '📦'
    }
};
