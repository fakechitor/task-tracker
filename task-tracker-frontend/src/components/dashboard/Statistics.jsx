import { useEffect } from 'react';
import '../../App.css';

export default function Statistics({ tasks }) {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === today;
    }).length;

    const overdueTasks = tasks.filter(task => {
        if (!task.deadline) return false;
        return new Date(task.deadline) < new Date();
    }).length;

    return (
        <div className="stats-section">
            <h2 className="section-title">Statistics</h2>
            <div className="dashboard-widgets">
                <div className="widget">
                    <h3>Total Tasks</h3>
                    <div className="widget-value">{tasks.length}</div>
                </div>
                <div className="widget">
                    <h3>Today’s Tasks</h3>
                    <div className="widget-value">{todayTasks}</div>
                </div>
                <div className="widget">
                    <h3>Overdue</h3>
                    <div className="widget-value">{overdueTasks}</div>
                </div>
            </div>
            <div className="stats-detail">
                <p>📊 Detailed analytics will be available soon.</p>
            </div>
        </div>
    );
}