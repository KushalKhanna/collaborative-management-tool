import { useDrop } from 'react-dnd';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ 
  title, 
  tasks = [], 
  column, 
  moveTask, 
  color, 
  handleViewTask, 
  onDelete,
  loggedInUser,
  otherLoggedInUser,
  currentOpenTaskId
}) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => moveTask(item.fromColumn, column, item.id)
  });

  return (
    <div ref={drop} className="bg-gray-800 rounded-lg p-4 h-full min-h-[500px]">
      <h2 className={`${color} text-white py-2 px-4 rounded-t-lg font-bold mb-4`}>
        {title} ({tasks.length})
      </h2>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task._id} className="relative">
            {/* Spinner for other users working on this task */}
            {otherLoggedInUser?.some(userId => 
              userId !== loggedInUser && task._id === currentOpenTaskId
            ) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            <KanbanCard
              task={task}
              fromColumn={column}
              onDelete={onDelete}
              handleViewTask={handleViewTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;