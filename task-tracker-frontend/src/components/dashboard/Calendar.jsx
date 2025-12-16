import { useState, useEffect } from 'react';
import { FaCalendarDay, FaExclamationCircle } from 'react-icons/fa';
import '../../App.css';

export default function Calendar({ tasks = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getTasksForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter(task => task.deadline === dateStr);
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(year, month, day);
        setSelectedDate(clickedDate);
    };

    // Генерация дней календаря
    const calendarDays = [];

    // Пустые дни в начале месяца
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push({ day: null, isCurrentMonth: false });
    }

    // Дни текущего месяца
    for (let day = 1; day <= days; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const dateTasks = tasks.filter(task => task.deadline === dateStr);

        calendarDays.push({
            day,
            isCurrentMonth: true,
            tasks: dateTasks,
            isToday: date.toDateString() === new Date().toDateString(),
            isSelected: selectedDate && date.toDateString() === selectedDate.toDateString()
        });
    }

    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <h2 className="section-title">
                    <FaCalendarDay style={{ marginRight: '10px' }} />
                    Calendar View
                </h2>
                <div className="calendar-controls">
                    <button className="calendar-nav-btn" onClick={prevMonth}>
                        &lt;
                    </button>
                    <span className="calendar-month-year">
                        {monthNames[month]} {year}
                    </span>
                    <button className="calendar-nav-btn" onClick={nextMonth}>
                        &gt;
                    </button>
                </div>
            </div>

            <div className="calendar-container">
                <div className="calendar-grid">
                    {/* Заголовки дней недели */}
                    {dayNames.map(day => (
                        <div key={day} className="calendar-day-header">
                            {day}
                        </div>
                    ))}

                    {/* Дни календаря */}
                    {calendarDays.map((item, index) => (
                        <div
                            key={index}
                            className={`calendar-day-cell ${
                                !item.isCurrentMonth ? 'other-month' : ''
                            } ${item.isToday ? 'today' : ''} ${
                                item.isSelected ? 'selected' : ''
                            }`}
                            onClick={() => item.isCurrentMonth && handleDateClick(item.day)}
                        >
                            {item.day && (
                                <>
                                    <div className="calendar-day-number">{item.day}</div>
                                    {item.tasks && item.tasks.length > 0 && (
                                        <div className="calendar-tasks-indicator">
                                            <span className="task-count-badge">
                                                {item.tasks.length}
                                            </span>
                                            {item.tasks.some(t => {
                                                const deadline = new Date(t.deadline);
                                                const today = new Date();
                                                return deadline < today && t.status !== 'FINISHED' && t.status !== 'CANCELLED';
                                            }) && (
                                                <FaExclamationCircle
                                                    className="overdue-indicator"
                                                    title="Overdue tasks"
                                                />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Панель выбранной даты */}
                {selectedDate && (
                    <div className="selected-date-panel">
                        <h3>Tasks for {selectedDate.toDateString()}</h3>
                        <div className="date-tasks-list">
                            {getTasksForDate(selectedDate).length > 0 ? (
                                getTasksForDate(selectedDate).map(task => (
                                    <div key={task.id} className="date-task-item">
                                        <div className="date-task-title">{task.title}</div>
                                        <div className="date-task-meta">
                                            <span className={`task-status status-${task.status.toLowerCase()}`}>
                                                {task.status}
                                            </span>
                                            <span className={`task-priority priority-${task.priority}`}>
                                                {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-tasks-message">No tasks for this date</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Легенда */}
                <div className="calendar-legend">
                    <div className="legend-item">
                        <div className="legend-color today-legend"></div>
                        <span>Today</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color selected-legend"></div>
                        <span>Selected</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color task-day-legend"></div>
                        <span>Has tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
}