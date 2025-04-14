import { useDrop } from 'react-dnd';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ title, tasks, column, moveTask, color, handleViewTask, onDelete }) => {
  const [, drop] = useDrop({
    accept: 'task',
    canDrop: (item) => {
      // Prevent moving out of "published"
      if (item.fromColumn === 'published') return false;
      return true;
    },
    drop: (item) => {
      if (column === 'published') {
        // Ask for confirmation before moving to published
        const confirmed = window.confirm("Are you sure you want to publish this story?");
        if (!confirmed) return;
      }
      moveTask(item.fromColumn, column, item.id);
    },
  });


  return (
    <div
      ref={drop}
      className="bg-gray-800 rounded-lg p-4 h-full min-h-[500px]"
    >
      <h2 className={`${color} text-white py-2 px-4 rounded-t-lg font-bold mb-4`}>
        {title} ({tasks?.length})
      </h2>
      <div className="space-y-3">
        {tasks && tasks.map(task => (
          <KanbanCard
            key={task._id}
            task={task}
            fromColumn={column}
            onDelete={onDelete}
            handleViewTask={handleViewTask}
            isPublished={column === 'isPublished'}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;