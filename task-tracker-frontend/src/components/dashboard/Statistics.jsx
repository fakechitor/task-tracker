import React, { useState, useEffect } from 'react';
import { FaChartBar, FaCalendarDay, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

export default function Statistics({ tasks = [] }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('all');

    useEffect(() => {
        const calculateLocalStats = () => {
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const filteredTasks = tasks.filter(task => {
                if (timeRange === 'week') {
                    const created = new Date(task.createdAt || now);
                    return created >= oneWeekAgo;
                }
                if (timeRange === 'month') {
                    const created = new Date(task.createdAt || now);
                    return created >= oneMonthAgo;
                }
                return true;
            });

            const statsData = {
                total: filteredTasks.length,
                overdue: filteredTasks.filter(task => {
                    if (!task.deadline) return false;
                    const deadline = new Date(task.deadline);
                    return deadline < now && task.status !== 'FINISHED' && task.status !== 'CANCELLED';
                }).length,
                amountByStatus: {
                    CREATED: filteredTasks.filter(t => t.status === 'CREATED').length,
                    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS').length,
                    FINISHED: filteredTasks.filter(t => t.status === 'FINISHED').length,
                    CANCELLED: filteredTasks.filter(t => t.status === 'CANCELLED').length,
                },
                averageCompletionTime: calculateAverageCompletion(filteredTasks),
                priorityDistribution: {
                    high: filteredTasks.filter(t => t.priority === 1).length,
                    medium: filteredTasks.filter(t => t.priority === 2).length,
                    low: filteredTasks.filter(t => t.priority === 3).length,
                }
            };

            setStats(statsData);
        };

        calculateLocalStats();
        setLoading(false);
    }, [tasks, timeRange]);

    const calculateAverageCompletion = (taskList) => {
        const completedTasks = taskList.filter(t => t.status === 'FINISHED' && t.createdAt && t.updatedAt);
        if (completedTasks.length === 0) return 0;

        const totalDays = completedTasks.reduce((sum, task) => {
            const created = new Date(task.createdAt);
            const finished = new Date(task.updatedAt);
            const diffTime = Math.abs(finished - created);
            return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }, 0);

        return Math.round(totalDays / completedTasks.length);
    };

    if (loading) return (
        <div className="statistics-content">
            <div className="loading">Loading statistics...</div>
        </div>
    );

    if (error) return (
        <div className="statistics-content">
            <div className="error-message">{error}</div>
        </div>
    );

    if (!stats) return (
        <div className="statistics-content">
            <div className="no-data">No data available</div>
        </div>
    );

    const statusOrder = ['CREATED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED'];
    const statusConfig = {
        CREATED: { label: 'Created', icon: FaClock, color: '#3b82f6', bgColor: '#dbeafe' },
        IN_PROGRESS: { label: 'In Progress', icon: FaClock, color: '#f59e0b', bgColor: '#fef3c7' },
        FINISHED: { label: 'Finished', icon: FaCheckCircle, color: '#10b981', bgColor: '#dcfce7' },
        CANCELLED: { label: 'Cancelled', icon: FaTimesCircle, color: '#ef4444', bgColor: '#fee2e2' },
    };

    const priorityConfig = {
        high: { label: 'High Priority', color: '#ef4444', bgColor: '#fee2e2' },
        medium: { label: 'Medium Priority', color: '#f59e0b', bgColor: '#fef3c7' },
        low: { label: 'Low Priority', color: '#10b981', bgColor: '#dcfce7' },
    };

    const priorityDistribution = stats.priorityDistribution || {
        high: 0,
        medium: 0,
        low: 0
    };

    // Находим самый частый статус
    const mostCommonStatus = Object.entries(stats.amountByStatus || {}).reduce(
        (a, b) => a[1] > b[1] ? a : b,
        ['NONE', 0]
    )[0];

    return (
        <div className="statistics-content">
            <div className="stats-header">
                <h2>
                    <FaChartBar style={{ marginRight: '10px' }} />
                    Task Statistics
                </h2>
                <div className="time-range-selector">
                    <button
                        className={`time-range-btn ${timeRange === 'all' ? 'active' : ''}`}
                        onClick={() => setTimeRange('all')}
                    >
                        All Time
                    </button>
                    <button
                        className={`time-range-btn ${timeRange === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeRange('month')}
                    >
                        Last Month
                    </button>
                    <button
                        className={`time-range-btn ${timeRange === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeRange('week')}
                    >
                        Last Week
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {/* Основные метрики */}
                <div className="stat-tile primary">
                    <div className="stat-header">
                        <FaChartBar className="stat-icon" />
                        <h3>Total Tasks</h3>
                    </div>
                    <div className="stat-number">{stats.total}</div>
                    
                </div>

                <div className="stat-tile warning">
                    <div className="stat-header">
                        <FaExclamationTriangle className="stat-icon" />
                        <h3>Overdue Tasks</h3>
                    </div>
                    <div className="stat-number">{stats.overdue}</div>

                </div>


                {/* Распределение по статусам */}
                {statusOrder.map(status => {
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    const count = stats.amountByStatus?.[status] || 0;
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

                    return (
                        <div
                            key={status}
                            className="stat-tile"
                            style={{
                                borderLeft: `4px solid ${config.color}`,
                                backgroundColor: config.bgColor,
                            }}
                        >
                            <div className="stat-header">
                                <Icon className="stat-icon" style={{ color: config.color }} />
                                <h3>{config.label}</h3>
                            </div>
                            <div className="stat-number" style={{ color: config.color }}>
                                {count}
                            </div>
                            <div className="stat-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: config.color
                                        }}
                                    ></div>
                                </div>
                                <span className="percentage">{percentage}%</span>
                            </div>
                        </div>
                    );
                })}

                {/* Распределение по приоритетам */}
                {Object.entries(priorityConfig).map(([key, config]) => {
                    const count = priorityDistribution[key] || 0;
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

                    return (
                        <div
                            key={key}
                            className="stat-tile priority-tile"
                            style={{
                                borderLeft: `4px solid ${config.color}`,
                                backgroundColor: config.bgColor,
                            }}
                        >
                            <h3>{config.label}</h3>
                            <div className="stat-number" style={{ color: config.color }}>
                                {count}
                            </div>
                            <div className="stat-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: config.color
                                        }}
                                    ></div>
                                </div>
                                <span className="percentage">{percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}