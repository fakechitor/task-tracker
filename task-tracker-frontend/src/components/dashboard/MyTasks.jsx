// src/components/dashboard/MyTasks.jsx
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import TrelloBoard from './TrelloBoard';
import AddTaskModal from './AddTaskModal'; // ← новый компонент

export default function MyTasks({ tasks, loading, error, onAddTask, onUpdateTask, onEditTask }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTask = () => {
        setIsModalOpen(true);
    };

    const handleTaskCreated = (newTask) => {
        onAddTask(newTask); // обновит список задач в Dashboard
        setIsModalOpen(false);
    };

    if (loading) {
        return <div className="loading">Loading your tasks...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="my-tasks-container">
            <div className="my-tasks-header">
                <h2>My Tasks</h2>
                <button className="add-task-btn" onClick={handleAddTask}>
                    <FaPlus /> Add Task
                </button>
            </div>

            <div className="trello-board-scroll-container">
                <TrelloBoard
                    tasks={tasks}
                    onUpdateTask={onUpdateTask}
                    onEditTask={onEditTask} // ← получаете из пропсов
                />
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <AddTaskModal
                    onClose={() => setIsModalOpen(false)}
                    onTaskCreated={handleTaskCreated}
                />
            )}
        </div>
    );
}