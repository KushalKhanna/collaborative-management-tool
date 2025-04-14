import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react'; // Trash icon (you can use any icon library)
import { toast } from 'react-toastify';
import axios from 'axios';

const KanbanCard = ({ task, fromColumn, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task._id, fromColumn },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${task._id}`);
      onDelete(task._id);
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-gray-700 p-4 rounded-lg cursor-move relative hover:bg-gray-600 transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {/* Delete Icon */}
      <button 
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>

      {/* Title */}
      <h3 className="font-semibold text-white">{task.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-300 mt-2">
        {task.description || "No description."}
      </p>

      {/* Footer: Ticket Number */}
      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
        <span>{task.ticketNumber}</span>
        <button className="text-xs bg-gray-600 px-2 py-1 rounded">
          View
        </button>
      </div>
    </div>
  );
};

export default KanbanCard;
