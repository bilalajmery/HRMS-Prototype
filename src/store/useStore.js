import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Sample data for employees
const sampleEmployees = [
    { id: 'EMP-1001', name: 'John Smith', email: 'john.smith@company.com', phone: '+1 555-0123', department: 'Engineering', designation: 'Senior Software Engineer', status: 'Active', joinDate: '2023-01-15', avatar: null },
    { id: 'EMP-1002', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', phone: '+1 555-0456', department: 'Sales', designation: 'Sales Manager', status: 'Active', joinDate: '2022-03-20', avatar: null },
    { id: 'EMP-1003', name: 'Michael Chen', email: 'michael.chen@company.com', phone: '+1 555-0789', department: 'Engineering', designation: 'Tech Lead', status: 'Active', joinDate: '2021-08-10', avatar: null },
    { id: 'EMP-1004', name: 'Emily Davis', email: 'emily.davis@company.com', phone: '+1 555-0321', department: 'HR', designation: 'HR Manager', status: 'Active', joinDate: '2022-06-01', avatar: null },
    { id: 'EMP-1005', name: 'James Brown', email: 'james.brown@company.com', phone: '+1 555-0654', department: 'Marketing', designation: 'Marketing Specialist', status: 'Probation', joinDate: '2024-01-05', avatar: null },
    { id: 'EMP-1006', name: 'Maria Garcia', email: 'maria.garcia@company.com', phone: '+1 555-0987', department: 'Finance', designation: 'Financial Analyst', status: 'Active', joinDate: '2023-04-12', avatar: null },
    { id: 'EMP-1007', name: 'David Lee', email: 'david.lee@company.com', phone: '+1 555-1234', department: 'Engineering', designation: 'DevOps Engineer', status: 'Active', joinDate: '2023-07-22', avatar: null },
    { id: 'EMP-1008', name: 'Jennifer Taylor', email: 'jennifer.taylor@company.com', phone: '+1 555-5678', department: 'Design', designation: 'UI/UX Designer', status: 'On Leave', joinDate: '2022-11-30', avatar: null },
    { id: 'EMP-1009', name: 'Robert Johnson', email: 'robert.johnson@company.com', phone: '+1 555-9012', department: 'Engineering', designation: 'Backend Developer', status: 'Active', joinDate: '2023-02-18', avatar: null },
    { id: 'EMP-1010', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', phone: '+1 555-3456', department: 'Support', designation: 'Customer Support Lead', status: 'Inactive', joinDate: '2021-05-10', avatar: null },
];

// Sample documents
const sampleDocuments = [
    { id: 'DOC-001', name: 'Employment Contract', type: 'Contract', employeeId: 'EMP-1001', employeeName: 'John Smith', uploadDate: '2023-01-15', expiryDate: '2025-01-15', status: 'Active', fileSize: '245 KB' },
    { id: 'DOC-002', name: 'Work Visa', type: 'Visa', employeeId: 'EMP-1003', employeeName: 'Michael Chen', uploadDate: '2024-02-01', expiryDate: '2024-12-31', status: 'Expiring', fileSize: '1.2 MB' },
    { id: 'DOC-003', name: 'ID Proof', type: 'ID Proof', employeeId: 'EMP-1002', employeeName: 'Sarah Wilson', uploadDate: '2022-03-20', expiryDate: '2027-03-20', status: 'Active', fileSize: '520 KB' },
    { id: 'DOC-004', name: 'AWS Certification', type: 'Certification', employeeId: 'EMP-1007', employeeName: 'David Lee', uploadDate: '2023-08-15', expiryDate: '2024-08-15', status: 'Expired', fileSize: '180 KB' },
    { id: 'DOC-005', name: 'NDA Agreement', type: 'Policy', employeeId: 'EMP-1001', employeeName: 'John Smith', uploadDate: '2023-01-15', expiryDate: null, status: 'Active', fileSize: '95 KB' },
];

// Sample assets
const sampleAssets = [
    { id: 'AST-001', name: 'MacBook Pro 14"', type: 'Laptop', serialNumber: 'MBP-2023-001', assignedTo: 'EMP-1001', assignedName: 'John Smith', status: 'Assigned', purchaseDate: '2023-01-10', value: 2499 },
    { id: 'AST-002', name: 'iPhone 15 Pro', type: 'Phone', serialNumber: 'IPH-2024-001', assignedTo: null, assignedName: null, status: 'Available', purchaseDate: '2024-01-05', value: 1199 },
    { id: 'AST-003', name: 'Dell UltraSharp 27"', type: 'Monitor', serialNumber: 'DEL-MON-001', assignedTo: 'EMP-1003', assignedName: 'Michael Chen', status: 'Assigned', purchaseDate: '2022-06-15', value: 649 },
    { id: 'AST-004', name: 'Apple Magic Keyboard', type: 'Keyboard', serialNumber: 'AMK-2023-001', assignedTo: 'EMP-1001', assignedName: 'John Smith', status: 'Assigned', purchaseDate: '2023-01-10', value: 299 },
    { id: 'AST-005', name: 'ThinkPad X1 Carbon', type: 'Laptop', serialNumber: 'TPX-2023-001', assignedTo: null, assignedName: null, status: 'Maintenance', purchaseDate: '2023-03-20', value: 1899 },
];

// Sample goals
const sampleGoals = [
    { id: 'GOAL-001', title: 'Increase Sales Revenue by 20%', description: 'Achieve 20% increase in quarterly sales revenue', category: 'Team', owner: 'Sarah Wilson', ownerId: 'EMP-1002', dueDate: '2024-12-31', progress: 72, status: 'In Progress', keyResults: ['Close 50 new deals', 'Increase average deal size by 15%', 'Reduce sales cycle by 10 days'] },
    { id: 'GOAL-002', title: 'Launch New Product Feature', description: 'Develop and launch the analytics dashboard feature', category: 'Individual', owner: 'John Smith', ownerId: 'EMP-1001', dueDate: '2024-06-30', progress: 100, status: 'Completed', keyResults: ['Design UI mockups', 'Implement API endpoints', 'Complete QA testing'] },
    { id: 'GOAL-003', title: 'Improve Customer Satisfaction', description: 'Increase NPS score from 35 to 50', category: 'Company OKR', owner: 'Emily Davis', ownerId: 'EMP-1004', dueDate: '2024-12-31', progress: 45, status: 'In Progress', keyResults: ['Reduce response time to < 2 hours', 'Implement feedback system', 'Train support team'] },
    { id: 'GOAL-004', title: 'Complete AWS Certification', description: 'Obtain AWS Solutions Architect certification', category: 'Individual', owner: 'David Lee', ownerId: 'EMP-1007', dueDate: '2024-03-31', progress: 20, status: 'Overdue', keyResults: ['Complete online course', 'Pass practice exams', 'Schedule and pass exam'] },
];

// Sample candidates
const sampleCandidates = [
    { id: 'CAN-001', name: 'Alex Johnson', email: 'alex.j@email.com', phone: '+1 555-1111', position: 'Senior Frontend Developer', stage: 'Interview', rating: 4.5, source: 'LinkedIn', appliedDate: '2024-01-10', resumeUrl: '#', notes: 'Strong React experience' },
    { id: 'CAN-002', name: 'Emma Williams', email: 'emma.w@email.com', phone: '+1 555-2222', position: 'Product Designer', stage: 'Offer', rating: 4.8, source: 'Referral', appliedDate: '2024-01-05', resumeUrl: '#', notes: 'Excellent portfolio' },
    { id: 'CAN-003', name: 'Ryan Miller', email: 'ryan.m@email.com', phone: '+1 555-3333', position: 'DevOps Engineer', stage: 'Screening', rating: 4.2, source: 'Website', appliedDate: '2024-01-15', resumeUrl: '#', notes: 'AWS certified' },
    { id: 'CAN-004', name: 'Sophie Brown', email: 'sophie.b@email.com', phone: '+1 555-4444', position: 'Marketing Manager', stage: 'Applied', rating: 4.0, source: 'Indeed', appliedDate: '2024-01-18', resumeUrl: '#', notes: 'B2B experience' },
    { id: 'CAN-005', name: 'Chris Taylor', email: 'chris.t@email.com', phone: '+1 555-5555', position: 'Senior Frontend Developer', stage: 'Applied', rating: 3.8, source: 'LinkedIn', appliedDate: '2024-01-20', resumeUrl: '#', notes: 'Vue.js background' },
];

// Sample interviews
const sampleInterviews = [
    { id: 'INT-001', candidateId: 'CAN-001', candidateName: 'Alex Johnson', position: 'Senior Frontend Developer', date: '2024-01-24', time: '14:00', type: 'Video', interviewers: ['Michael Chen', 'John Smith'], meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'Scheduled', duration: 60 },
    { id: 'INT-002', candidateId: 'CAN-002', candidateName: 'Emma Williams', position: 'Product Designer', date: '2024-01-25', time: '10:00', type: 'On-site', interviewers: ['Jennifer Taylor', 'Emily Davis'], meetingLink: null, status: 'Scheduled', duration: 90 },
    { id: 'INT-003', candidateId: 'CAN-003', candidateName: 'Ryan Miller', position: 'DevOps Engineer', date: '2024-01-23', time: '15:30', type: 'Phone', interviewers: ['David Lee'], meetingLink: null, status: 'Completed', duration: 45 },
];

// Sample leave requests
const sampleLeaveRequests = [
    { id: 'LV-001', employeeId: 'EMP-1001', employeeName: 'John Smith', type: 'Annual', startDate: '2024-01-25', endDate: '2024-01-30', days: 5, reason: 'Family vacation', status: 'Pending' },
    { id: 'LV-002', employeeId: 'EMP-1002', employeeName: 'Sarah Wilson', type: 'Sick', startDate: '2024-01-22', endDate: '2024-01-23', days: 2, reason: 'Medical appointment', status: 'Approved' },
    { id: 'LV-003', employeeId: 'EMP-1007', employeeName: 'David Lee', type: 'Personal', startDate: '2024-02-01', endDate: '2024-02-01', days: 1, reason: 'Personal errands', status: 'Pending' },
];

// Sample expenses
const sampleExpenses = [
    { id: 'EXP-001', employeeId: 'EMP-1002', employeeName: 'Sarah Wilson', type: 'Meals', amount: 125, date: '2024-01-15', description: 'Client dinner meeting', status: 'Pending', receiptUrl: '#' },
    { id: 'EXP-002', employeeId: 'EMP-1001', employeeName: 'John Smith', type: 'Travel', amount: 450, date: '2024-01-10', description: 'Conference travel expenses', status: 'Approved', receiptUrl: '#' },
    { id: 'EXP-003', employeeId: 'EMP-1007', employeeName: 'David Lee', type: 'Equipment', amount: 89, date: '2024-01-18', description: 'USB-C hub for home office', status: 'Rejected', receiptUrl: '#' },
];

// Sample courses
const sampleCourses = [
    { id: 'CRS-001', title: 'Effective Leadership', description: 'Learn leadership skills for modern managers', lessons: 8, duration: '3 hours', level: 'Intermediate', rating: 4.5, reviews: 125, thumbnail: null, category: 'Leadership', enrolled: true, progress: 60 },
    { id: 'CRS-002', title: 'React Advanced Patterns', description: 'Master advanced React patterns and best practices', lessons: 12, duration: '5 hours', level: 'Advanced', rating: 4.8, reviews: 89, thumbnail: null, category: 'Technical', enrolled: true, progress: 100 },
    { id: 'CRS-003', title: 'Communication Skills', description: 'Improve your professional communication', lessons: 6, duration: '2 hours', level: 'Beginner', rating: 4.3, reviews: 210, thumbnail: null, category: 'Soft Skills', enrolled: false, progress: 0 },
    { id: 'CRS-004', title: 'Project Management Fundamentals', description: 'Essential project management skills', lessons: 10, duration: '4 hours', level: 'Intermediate', rating: 4.6, reviews: 156, thumbnail: null, category: 'Management', enrolled: false, progress: 0 },
];

// Sample social posts
const samplePosts = [
    {
        id: 'POST-001',
        authorId: 'EMP-1003',
        authorName: 'Michael Chen',
        authorRole: 'Tech Lead',
        content: 'Excited to announce that our team just shipped the new dashboard feature! Great work everyone! 🚀',
        type: 'text',
        likes: ['EMP-1001', 'EMP-1002'],
        comments: [
            { id: 'CMT-1', author: 'John Smith', authorAvatar: null, content: 'Awesome work team!', timestamp: '2024-01-22T11:00:00Z' }
        ],
        createdAt: '2024-01-22T10:30:00Z',
        isRecognition: false,
        author: 'Michael Chen'
    },
    {
        id: 'POST-002',
        authorId: 'EMP-1004',
        authorName: 'Emily Davis',
        authorRole: 'HR Manager',
        content: 'Kudos to Sarah Wilson for closing the biggest deal this quarter! Your dedication is truly inspiring. 🏆',
        type: 'recognition',
        likes: ['EMP-1003', 'EMP-1001', 'EMP-1002'],
        comments: [],
        createdAt: '2024-01-21T14:15:00Z',
        isRecognition: true,
        recognizedPerson: 'Sarah Wilson',
        author: 'Emily Davis'
    },
    {
        id: 'POST-003',
        authorId: 'EMP-1001',
        authorName: 'John Smith',
        authorRole: 'Senior Software Engineer',
        content: 'Just completed the AWS Solutions Architect course. Learning never stops! 🎓',
        type: 'text',
        likes: ['EMP-1004'],
        comments: [],
        createdAt: '2024-01-20T09:00:00Z',
        isRecognition: false,
        author: 'John Smith'
    },
];

// Sample notifications
const sampleNotifications = [
    { id: 'NOT-001', type: 'leave', title: 'Leave Request', message: 'John Smith requested 5 days annual leave', time: '2 hours ago', read: false },
    { id: 'NOT-002', type: 'review', title: 'Performance Review', message: 'Q4 performance reviews are due next week', time: '1 day ago', read: false },
    { id: 'NOT-003', type: 'interview', title: 'Interview Scheduled', message: 'Interview with Alex Johnson at 2:00 PM today', time: '3 hours ago', read: true },
    { id: 'NOT-004', type: 'goal', title: 'Goal Completed', message: 'Sarah Wilson completed "Launch New Product Feature"', time: '2 days ago', read: true },
];

const useStore = create(
    persist(
        (set, get) => ({
            // Auth State
            isAuthenticated: false,
            user: null,

            // Data States
            employees: sampleEmployees,
            documents: sampleDocuments,
            assets: sampleAssets,
            goals: sampleGoals,
            candidates: sampleCandidates,
            interviews: sampleInterviews,
            leaveRequests: sampleLeaveRequests,
            expenses: sampleExpenses,
            courses: sampleCourses,
            posts: samplePosts,
            notifications: sampleNotifications,

            // UI States
            sidebarOpen: true,
            toasts: [],

            // Auth Actions
            login: (email, password) => {
                if (email && password) {
                    set({
                        isAuthenticated: true,
                        user: {
                            id: 'USR-001',
                            name: 'Admin User',
                            email: email,
                            role: 'Administrator',
                            avatar: null
                        }
                    });
                    return true;
                }
                return false;
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
            },

            // Employee Actions
            addEmployee: (employee) => {
                const id = `EMP-${1000 + get().employees.length + 1}`;
                set((state) => ({
                    employees: [...state.employees, { ...employee, id }]
                }));
                get().addToast('Employee added successfully', 'success');
                return id;
            },

            updateEmployee: (id, updates) => {
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id ? { ...emp, ...updates } : emp
                    )
                }));
                get().addToast('Employee updated successfully', 'success');
            },

            deleteEmployee: (id) => {
                set((state) => ({
                    employees: state.employees.filter((emp) => emp.id !== id)
                }));
                get().addToast('Employee removed successfully', 'success');
            },

            // Document Actions
            addDocument: (doc) => {
                const id = `DOC-${String(get().documents.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    documents: [...state.documents, { ...doc, id }]
                }));
                get().addToast('Document uploaded successfully', 'success');
            },

            updateDocument: (id, updates) => {
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, ...updates } : doc
                    )
                }));
                get().addToast('Document updated successfully', 'success');
            },

            deleteDocument: (id) => {
                set((state) => ({
                    documents: state.documents.filter((doc) => doc.id !== id)
                }));
                get().addToast('Document deleted successfully', 'success');
            },

            // Asset Actions
            addAsset: (asset) => {
                const id = `AST-${String(get().assets.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    assets: [...state.assets, { ...asset, id }]
                }));
                get().addToast('Asset added successfully', 'success');
            },

            updateAsset: (id, updates) => {
                set((state) => ({
                    assets: state.assets.map((asset) =>
                        asset.id === id ? { ...asset, ...updates } : asset
                    )
                }));
                get().addToast('Asset updated successfully', 'success');
            },

            assignAsset: (assetId, employeeId, employeeName) => {
                set((state) => ({
                    assets: state.assets.map((asset) =>
                        asset.id === assetId
                            ? { ...asset, assignedTo: employeeId, assignedName: employeeName, status: 'Assigned' }
                            : asset
                    )
                }));
                get().addToast('Asset assigned successfully', 'success');
            },

            returnAsset: (assetId) => {
                set((state) => ({
                    assets: state.assets.map((asset) =>
                        asset.id === assetId
                            ? { ...asset, assignedTo: null, assignedName: null, status: 'Available' }
                            : asset
                    )
                }));
                get().addToast('Asset returned successfully', 'success');
            },

            // Goal Actions
            addGoal: (goal) => {
                const id = `GOAL-${String(get().goals.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    goals: [...state.goals, { ...goal, id, status: 'In Progress' }]
                }));
                get().addToast('Goal created successfully', 'success');
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === id ? { ...goal, ...updates } : goal
                    )
                }));
                get().addToast('Goal updated successfully', 'success');
            },

            updateGoalProgress: (id, progress) => {
                set((state) => ({
                    goals: state.goals.map((goal) =>
                        goal.id === id
                            ? { ...goal, progress, status: progress >= 100 ? 'Completed' : goal.status }
                            : goal
                    )
                }));
            },

            deleteGoal: (id) => {
                set((state) => ({
                    goals: state.goals.filter((goal) => goal.id !== id)
                }));
                get().addToast('Goal deleted successfully', 'success');
            },

            // Candidate Actions
            addCandidate: (candidate) => {
                const id = `CAN-${String(get().candidates.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    candidates: [...state.candidates, { ...candidate, id, stage: 'Applied' }]
                }));
                get().addToast('Candidate added successfully', 'success');
            },

            updateCandidateStage: (id, stage) => {
                set((state) => ({
                    candidates: state.candidates.map((can) =>
                        can.id === id ? { ...can, stage } : can
                    )
                }));
                get().addToast(`Candidate moved to ${stage}`, 'success');
            },

            hireCandidate: (candidateId) => {
                const candidate = get().candidates.find((c) => c.id === candidateId);
                if (candidate) {
                    const empId = get().addEmployee({
                        name: candidate.name,
                        email: candidate.email,
                        phone: candidate.phone,
                        department: 'Pending Assignment',
                        designation: candidate.position,
                        status: 'Probation',
                        joinDate: new Date().toISOString().split('T')[0]
                    });

                    set((state) => ({
                        candidates: state.candidates.map((c) =>
                            c.id === candidateId ? { ...c, stage: 'Hired' } : c
                        )
                    }));

                    get().addToast(`${candidate.name} has been hired!`, 'success');
                    return empId;
                }
            },

            // Interview Actions
            addInterview: (interview) => {
                const id = `INT-${String(get().interviews.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    interviews: [...state.interviews, { ...interview, id, status: 'Scheduled' }]
                }));
                get().addToast('Interview scheduled successfully', 'success');
            },

            updateInterview: (id, updates) => {
                set((state) => ({
                    interviews: state.interviews.map((int) =>
                        int.id === id ? { ...int, ...updates } : int
                    )
                }));
                get().addToast('Interview updated successfully', 'success');
            },

            cancelInterview: (id) => {
                set((state) => ({
                    interviews: state.interviews.map((int) =>
                        int.id === id ? { ...int, status: 'Cancelled' } : int
                    )
                }));
                get().addToast('Interview cancelled', 'warning');
            },

            // Leave Actions
            addLeaveRequest: (request) => {
                const id = `LV-${String(get().leaveRequests.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    leaveRequests: [...state.leaveRequests, { ...request, id, status: 'Pending' }]
                }));
                get().addToast('Leave request submitted', 'success');
            },

            approveLeave: (id) => {
                set((state) => ({
                    leaveRequests: state.leaveRequests.map((req) =>
                        req.id === id ? { ...req, status: 'Approved' } : req
                    )
                }));
                get().addToast('Leave request approved', 'success');
            },

            rejectLeave: (id) => {
                set((state) => ({
                    leaveRequests: state.leaveRequests.map((req) =>
                        req.id === id ? { ...req, status: 'Rejected' } : req
                    )
                }));
                get().addToast('Leave request rejected', 'warning');
            },

            // Expense Actions
            addExpense: (expense) => {
                const id = `EXP-${String(get().expenses.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    expenses: [...state.expenses, { ...expense, id, status: 'Pending' }]
                }));
                get().addToast('Expense submitted successfully', 'success');
            },

            approveExpense: (id) => {
                set((state) => ({
                    expenses: state.expenses.map((exp) =>
                        exp.id === id ? { ...exp, status: 'Approved' } : exp
                    )
                }));
                get().addToast('Expense approved', 'success');
            },

            rejectExpense: (id) => {
                set((state) => ({
                    expenses: state.expenses.map((exp) =>
                        exp.id === id ? { ...exp, status: 'Rejected' } : exp
                    )
                }));
                get().addToast('Expense rejected', 'warning');
            },

            updateExpenseStatus: (id, status) => {
                set((state) => ({
                    expenses: state.expenses.map((exp) =>
                        exp.id === id ? { ...exp, status } : exp
                    )
                }));
                get().addToast(`Expense marked as ${status}`, 'success');
            },

            deleteExpense: (id) => {
                set((state) => ({
                    expenses: state.expenses.filter((exp) => exp.id !== id)
                }));
                get().addToast('Expense deleted successfully', 'success');
            },

            // Social/Posts Actions
            addPost: (post) => {
                const id = `POST-${String(get().posts.length + 1).padStart(3, '0')}`;
                set((state) => ({
                    posts: [
                        {
                            ...post,
                            id,
                            likes: [],
                            comments: [],
                            createdAt: new Date().toISOString()
                        },
                        ...state.posts
                    ]
                }));
                get().addToast('Post published', 'success');
            },

            likePost: (postId, userId) => {
                set((state) => ({
                    posts: state.posts.map((post) => {
                        if (post.id === postId) {
                            const isLiked = post.likes.includes(userId);
                            return {
                                ...post,
                                likes: isLiked
                                    ? post.likes.filter(id => id !== userId)
                                    : [...post.likes, userId]
                            };
                        }
                        return post;
                    })
                }));
            },

            addComment: (postId, comment) => {
                const commentId = `CMT-${Date.now()}`;
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === postId ? {
                            ...post,
                            comments: [...post.comments, { ...comment, id: commentId, timestamp: new Date().toISOString() }]
                        } : post
                    )
                }));
            },

            // Notification Actions
            markNotificationRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((not) =>
                        not.id === id ? { ...not, read: true } : not
                    )
                }));
            },

            markAllNotificationsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((not) => ({ ...not, read: true }))
                }));
            },

            // UI Actions
            toggleSidebar: () => {
                set((state) => ({ sidebarOpen: !state.sidebarOpen }));
            },

            addToast: (message, type = 'info') => {
                const id = Date.now();
                set((state) => ({
                    toasts: [...state.toasts, { id, message, type }]
                }));

                setTimeout(() => {
                    set((state) => ({
                        toasts: state.toasts.filter((t) => t.id !== id)
                    }));
                }, 3000);
            },

            removeToast: (id) => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            },

            // Computed Values
            getEmployeeById: (id) => get().employees.find((e) => e.id === id),
            getActiveEmployees: () => get().employees.filter((e) => e.status === 'Active'),
            getDepartments: () => [...new Set(get().employees.map((e) => e.department))],
            getUnreadNotificationsCount: () => get().notifications.filter((n) => !n.read).length,
        }),
        {
            name: 'hrms-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                employees: state.employees,
                documents: state.documents,
                assets: state.assets,
                goals: state.goals,
                candidates: state.candidates,
                interviews: state.interviews,
                leaveRequests: state.leaveRequests,
                expenses: state.expenses,
                courses: state.courses,
                posts: state.posts,
                sidebarOpen: state.sidebarOpen,
            })
        }
    )
);

export default useStore;
