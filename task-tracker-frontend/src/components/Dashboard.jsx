import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTasks, FaProjectDiagram, FaCalendarAlt, FaChartBar, FaCogs, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import '../App.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('User');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Закрыть выпадающее меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Загрузка username
    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || 'User';
        setUsername(savedUsername);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const quickActions = [
        { id: 'tasks', label: 'My Tasks', icon: FaTasks },
        { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
        { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt },
        { id: 'reports', label: 'Reports', icon: FaChartBar },
        { id: 'settings', label: 'Settings', icon: FaCogs },
    ];

    return (
        <div className="dashboard-full">
            {/* Header */}
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

            {/* Quick Actions */}
            <div className="quick-actions-bar">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button key={action.id} className="quick-action-btn">
                            <Icon className="action-icon" /> {action.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="welcome-section">
                    <h2>Welcome back, {username}!</h2>
                    <p>Your productivity dashboard is ready.</p>
                </div>

                <div className="dashboard-widgets">
                    <div className="widget">
                        <h3>Today's Tasks</h3>
                        <div className="widget-value">0</div>
                    </div>
                    <div className="widget">
                        <h3>Active Projects</h3>
                        <div className="widget-value">0</div>
                    </div>
                    <div className="widget">
                        <h3>Overdue</h3>
                        <div className="widget-value">0</div>
                    </div>
                </div>
            </main>
        </div>
    );
}