// src/components/dashboard/TrelloBoard.jsx
import React from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

const STATUSES = ['CREATED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED'];
const STATUS_TITLES = {
    CREATED: 'Created',
    IN_PROGRESS: 'In Progress',
    FINISHED: 'Finished',
    CANCELLED: 'Cancelled',
};

const STATUS_COLORS = {
    CREATED: '#dbeafe',
    IN_PROGRESS: '#fef3c7',
    FINISHED: '#dcfce7',
    CANCELLED: '#fee2e2',
};

const STATUS_TEXT_COLORS = {
    CREATED: '#1d4ed8',
    IN_PROGRESS: '#d97706',
    FINISHED: '#166534',
    CANCELLED: '#b91c1c',
};

// 💡 TaskCard — получает onEdit как пропс
function TaskCard({ task, isOverlay = false, onEdit }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.id,
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 1: return 'High';
            case 2: return 'Medium';
            case 3: return 'Low';
            default: return 'Normal';
        }
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isOverlay ? 1000 : isDragging ? 100 : 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging && !isOverlay ? 0 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`trello-card ${isDragging && !isOverlay ? 'dragging-placeholder' : ''}`}
        >
            {/* Зона перетаскивания — вся карточка, кроме кнопки */}
            <div
                {...listeners}
                {...attributes}
                style={{ width: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <div className="trello-card-content">
                    <div className="trello-card-title">{task.title || 'Untitled Task'}</div>
                    {task.description && (
                        <div className="trello-card-description">{task.description}</div>
                    )}
                </div>
                <div className="trello-card-meta">
                    {task.deadline && (
                        <span className="trello-card-deadline">
              <FaClock /> {formatDate(task.deadline)}
            </span>
                    )}
                    {task.priority !== undefined && (
                        <span
                            className="trello-card-priority"
                            style={{
                                backgroundColor: STATUS_COLORS[task.status],
                                color: STATUS_TEXT_COLORS[task.status],
                            }}
                        >
              <FaExclamationTriangle /> {getPriorityText(task.priority)}
            </span>
                    )}
                </div>
            </div>

            {/* Кнопка редактирования — вне зоны drag */}
            {!isOverlay && onEdit && (
                <button
                    className="trello-card-edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                    }}
                    aria-label="Edit task"
                >
                    ✏️
                </button>
            )}
        </div>
    );
}

// 💡 Column — получает onEdit и передаёт в TaskCard
function Column({ id, title, tasks, color, textColor, onEdit }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="trello-column"
            style={{ backgroundColor: color, borderColor: textColor }}
        >
            <div className="trello-column-header" style={{ borderColor: textColor }}>
                <h3 style={{ color: textColor }}>{title}</h3>
                <span className="trello-column-count">{tasks.length}</span>
            </div>
            <div className="trello-column-content">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEdit} // ← передаём дальше
                    />
                ))}
            </div>
        </div>
    );
}

// 💡 Основной компонент
export default function TrelloBoard({ tasks, onUpdateTask, onEditTask }) {
    const [activeTask, setActiveTask] = React.useState(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragStart = (event) => {
        const taskId = event.active.id;
        const task = tasks.find(t => t.id === taskId);
        setActiveTask(task);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            const updatedTask = { ...task, status: newStatus };
            onUpdateTask(updatedTask);
        }
    };

    const handleDragEnd = () => {
        setActiveTask(null);
    };

    const columns = {};
    STATUSES.forEach(status => {
        columns[status] = tasks.filter(task => task.status === status);
    });

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="trello-board">
                {STATUSES.map(status => (
                    <Column
                        key={status}
                        id={status}
                        title={STATUS_TITLES[status]}
                        tasks={columns[status]}
                        color={STATUS_COLORS[status]}
                        textColor={STATUS_TEXT_COLORS[status]}
                        onEdit={onEditTask} // ← передаём из Dashboard
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <TaskCard
                        task={activeTask}
                        isOverlay={true}
                        style={{ zIndex: 2000 }} // ← добавьте это
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}