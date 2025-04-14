import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ViewTaskModal = ({ show, onClose, task, onUpdate, users = [], onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [assignee, setAssignee] = useState('');
  const [label, setLabel] = useState('');
  const [reporter, setReporter] = useState('');
  const [status, setStatus] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setTags(task.tags?.join(', ') || '');
      setAssignee(task.assignee || '');
      setLabel(task.label || '');
      setReporter(task.reporter || '');
      setStatus(task.status || '');
      setTicketNumber(task.ticketNumber || '');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      assignee,
      label,
      reporter,
      status,
      ticketNumber
    };

    onUpdate(updatedTask);
    onClose();
  };

  if (!show || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Ticket #{task.ticketNumber}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Edit your story..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={5}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Assignee</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user._id} value={user.userName}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Label</label>
              <select
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select label</option>
                <option value="bug">🐞 Bug</option>
                <option value="feature">✨ Feature</option>
                <option value="improvement">🛠️ Improvement</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Reporter</label>
              <input
                type="text"
                value={reporter}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Update Button */}
          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewTaskModal;
