import { useState } from 'react';
import { X } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, users = [], currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [assignee, setAssignee] = useState('');
  const [label, setLabel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const taskData = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      assignee,
      label,
      reporter: currentUser || 'Unknown'
    };

    onSubmit(taskData);
    setTitle('');
    setDescription('');
    setTags('');
    setAssignee('');
    setLabel('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Create a New Story</h2>

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
              placeholder="Write your story..."
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
                value={currentUser || 'Unknown'}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
