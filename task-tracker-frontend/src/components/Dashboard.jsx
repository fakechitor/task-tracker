// src/components/Dashboard.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaTasks,
    FaCalendarAlt,
    FaChartBar,
    FaSignOutAlt,
} from 'react-icons/fa';
import MyTasks from './dashboard/MyTasks';
import Statistics from './dashboard/Statistics';
import Calendar from './dashboard/Calendar';
import EditTaskModal from './dashboard/EditTaskModal'; // ← импорт модального окна
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

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/dashboard/statistics')) return 'statistics';
        if (path.includes('/dashboard/calendar')) return 'calendar';
        return 'tasks';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab);

    // Обработчики редактирования
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

    // Закрытие выпадающего меню
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Загрузка данных пользователя
    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || 'User';
        setUsername(savedUsername);
    }, []);

    // Загрузка задач
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

    return (
        <div className="dashboard-full">
            {/* Header — всегда сверху */}
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

            {/* Панель быстрого доступа */}
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

            {/* Основной контент */}
            <main className="dashboard-main">
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

                {activeTab === 'statistics' && <Statistics tasks={tasks} />}
                {activeTab === 'calendar' && <Calendar />}
            </main>

            {/* Модальное окно редактирования — последний элемент! */}
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