import { useDrop } from 'react-dnd';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ title, tasks, column, moveTask, color }) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => moveTask(item.fromColumn, column, item.id)
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
            key={task.id} 
            task={task} 
            fromColumn={column}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;