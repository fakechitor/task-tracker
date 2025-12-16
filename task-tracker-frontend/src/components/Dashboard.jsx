import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaTasks,
    FaCalendarAlt,
    FaChartBar,
    FaSignOutAlt,
    FaHome,
    FaClipboardCheck,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle, FaCalendarDay,
} from 'react-icons/fa';
import MyTasks from './dashboard/MyTasks';
import Statistics from './dashboard/Statistics';
import Calendar from './dashboard/Calendar';
import EditTaskModal from './dashboard/EditTaskModal';
import '../App.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('User');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const dropdownRef = useRef(null);

    const [activeTab, setActiveTab] = useState('tasks');

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/dashboard/statistics')) {
            setActiveTab('statistics');
        } else if (path.includes('/dashboard/calendar')) {
            setActiveTab('calendar');
        } else {
            setActiveTab('tasks');
        }
    }, [location.pathname]);

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
    };

    const handleTaskDeleted = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setEditingTask(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || 'User';
        setUsername(savedUsername);
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated');
                setLoading(false);
                return;
            }

            try {
                const id = localStorage.getItem('id');
                const params = new URLSearchParams({ userId: id });
                const response = await fetch(`http://localhost:8090/api/v1/tasks?${params}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 403) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setTasks(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [navigate]);

    // Статистика для дашборда
    const dashboardStats = {
        total: tasks.length,
        overdue: tasks.filter(task => {
            if (!task.deadline) return false;
            const deadline = new Date(task.deadline);
            const today = new Date();
            return deadline < today && task.status !== 'FINISHED' && task.status !== 'CANCELLED';
        }).length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        finished: tasks.filter(t => t.status === 'FINISHED').length,
        created: tasks.filter(t => t.status === 'CREATED').length,
        cancelled: tasks.filter(t => t.status === 'CANCELLED').length,
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const onAddTask = (newTask) => {
        setTasks(prev => [newTask, ...prev]);
    };

    const onUpdateTask = async (updatedTask) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`http://localhost:8090/api/v1/tasks/${updatedTask.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                deadline: updatedTask.deadline,
                priority: updatedTask.priority,
            }),
        });

        if (!response.ok) throw new Error('Failed to update task');

        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const quickActions = [
        { id: 'tasks', label: 'My Tasks', icon: FaTasks, path: '/dashboard' },
        { id: 'statistics', label: 'Statistics', icon: FaChartBar, path: '/dashboard/statistics' },
        { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt, path: '/dashboard/calendar' },
    ];

    const dashboardWidgets = [
        { id: 'total', label: 'Total Tasks', value: dashboardStats.total, icon: FaClipboardCheck, color: '#6366f1' },
        { id: 'overdue', label: 'Overdue', value: dashboardStats.overdue, icon: FaExclamationTriangle, color: '#ef4444' },
        { id: 'inProgress', label: 'In Progress', value: dashboardStats.inProgress, icon: FaClock, color: '#f59e0b' },
        { id: 'completed', label: 'Completed', value: dashboardStats.finished, icon: FaCheckCircle, color: '#10b981' },
    ];

    return (
        <div className="dashboard-full">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo">
                        <FaTasks className="logo-icon" />
                        <span className="logo-text">TaskTracker</span>
                    </div>
                </div>

                <div className="header-right" ref={dropdownRef}>
                    <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <span className="username">{username}</span>
                        <span className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {dropdownOpen && (
                        <div className="user-dropdown">
                            <button className="dropdown-item" onClick={handleLogout}>
                                <FaSignOutAlt className="dropdown-icon" /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="quick-actions-bar">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            className={`quick-action-btn ${activeTab === action.id ? 'active' : ''}`}
                            onClick={() => navigate(action.path)}
                        >
                            <Icon className="action-icon" /> {action.label}
                        </button>
                    );
                })}
            </div>

            <main className="dashboard-main">
                {/* WELCOME SECTION - только на главной странице */}
                {activeTab === 'tasks' && (
                    <>
                        <div className="welcome-section">
                            <h2>Welcome back, {username}!</h2>
                            <p>Here's an overview of your tasks and productivity.</p>
                        </div>

                        {/* DASHBOARD WIDGETS */}
                        <div className="dashboard-widgets">
                            {dashboardWidgets.map(widget => {
                                const Icon = widget.icon;
                                return (
                                    <div key={widget.id} className="widget" onClick={() => {
                                        if (widget.id === 'statistics') {
                                            navigate('/dashboard/statistics');
                                        }
                                    }}>
                                        <h3>{widget.label}</h3>
                                        <div className="widget-value" style={{ color: widget.color }}>
                                            {widget.value}
                                        </div>
                                        <div className="widget-icon">
                                            <Icon size={24} style={{ color: widget.color, marginTop: '12px' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}



                {/* MY TASKS BOARD */}
                {activeTab === 'tasks' && (
                    <MyTasks
                        tasks={tasks}
                        loading={loading}
                        error={error}
                        onAddTask={onAddTask}
                        onUpdateTask={onUpdateTask}
                        onEditTask={handleEditTask}
                    />
                )}

                {/* STATISTICS PAGE */}
                {activeTab === 'statistics' && <Statistics tasks={tasks} />}

                {/* CALENDAR PAGE */}
                {activeTab === 'calendar' && <Calendar tasks={tasks} />}
            </main>

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                />
            )}
        </div>
    );
}