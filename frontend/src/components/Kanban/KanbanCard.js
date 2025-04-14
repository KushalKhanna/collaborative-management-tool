import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const KanbanCard = ({ task, fromColumn, onDelete, handleViewTask }) => {
  const isPublished = fromColumn === 'published';

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task._id, fromColumn },
    canDrag: !isPublished, // Prevent dragging from published
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${task._id}`);
      onDelete(task._id, fromColumn);
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  const handleCardClick = () => {
    if (!isPublished) {
      handleViewTask(task);
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-gray-700 p-4 rounded-lg relative transition-opacity cursor-${isPublished ? 'default' : 'move'} 
        ${isDragging ? 'opacity-50' : 'opacity-100'} hover:bg-gray-600`}
      onClick={handleCardClick}
    >
      {/* Delete Icon */}
      {!isPublished && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Title */}
      <h3 className={`font-semibold break-words ${isPublished ? 'line-through text-gray-400' : 'text-white'}`}>
        {task.title}
      </h3>

      {/* Description */}
      <p className={`text-sm mt-2 break-words ${isPublished ? 'line-through text-gray-500' : 'text-gray-300'}`}>
        {task.description || "No description."}
      </p>

      {/* Footer: Ticket Number */}
      <div className="flex justify-end mt-3 text-xs text-gray-400">
        <span>#{task.ticketNumber}</span>
      </div>
    </div>
  );
};

export default KanbanCard;
