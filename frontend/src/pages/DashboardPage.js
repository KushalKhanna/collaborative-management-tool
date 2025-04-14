import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from '../components/Navbar';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import axios from 'axios';
import CreateTaskModal from '../components/CreateTaskModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewTaskModal from '../components/ViewTaskModal';

const DashboardPage = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: [],
    isPublished: []
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Array of distinct colors for user circles
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500',
    'bg-red-600', 'bg-orange-600', 'bg-yellow-600', 'bg-green-600', 'bg-teal-600',
    'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-gray-600'
  ];

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/get-all-users');
        setUsers(response.data);  // Assuming response.data is an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch stories/tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/get-all-tasks');
        const allTasks = response.data;

        const grouped = {
          todo: [],
          inProgress: [],
          review: [],
          done: []
        };

        allTasks.forEach(task => {
          const status = task.status || 'todo';
          if (grouped[status]) {
            grouped[status].push(task);
          }
        });

        setTasks(grouped);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const moveTask = async (fromColumn, toColumn, taskId) => {
    if (fromColumn === toColumn) return;
  
    const taskToMove = tasks[fromColumn]?.find(task => task._id === taskId);
    if (!taskToMove) return;
  
    try {
      await axios.put(`http://localhost:5000/api/tasks/update/${taskId}`, {
        status: toColumn
      });
  
      setTasks(prev => {
        const updatedFrom = prev[fromColumn]?.filter(task => task._id !== taskId) || [];
        const updatedTo = [...(prev[toColumn] || []), { ...taskToMove, status: toColumn }];
  
        return {
          ...prev,
          [fromColumn]: updatedFrom,
          [toColumn]: updatedTo
        };
      });
    } catch (err) {
      console.error("Failed to move task:", err);
    }
  };

  const handleDelete = (deletedId, fromColumn) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [fromColumn]: prevTasks[fromColumn].filter(task => task._id !== deletedId)
    }));
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks/create', taskData);
      console.log('Task Created:', response.data);

      setTasks(prev => ({
        ...prev,
        todo: [...prev.todo || [], response.data.newTask]
      }));

      toast.success('Task created successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  };

  // CLICK VIEW TASK
  const handleViewTask = async (taskData) => {
    console.log(taskData);
    setSelectedTask(taskData);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
        <Navbar />

        <div className="flex flex-1 overflow-hidden pt-16">
          {/* Collapsible Sidebar */}
          <div className={`bg-gray-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
            <div
              className="p-4 flex items-center cursor-pointer hover:bg-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <div className="text-2xl">
                {sidebarOpen ? '◀' : '▶'}
              </div>
            </div>

            {sidebarOpen && (
              <div className="p-4 space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Task
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded">
                  Filter
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded">
                  Reports
                </button>
              </div>
            )}
          </div>

          {/* Main Content - Kanban Board */}
          <div className="flex-1 overflow-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Project Board</h1>
            <div className="p-6">
              <div className="flex flex-wrap justify-start gap-4">
                {users.map((user, index) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className={`flex items-center justify-center text-white rounded-full w-12 h-12 text-xl cursor-pointer 
                      ${colors[index % colors.length]} 
                      ${selectedUser === user._id ? 'border-2 border-balck-400' : ''}`}
                  >
                    {user.name.charAt(0)} {/* Display the first letter of the user's name */}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <KanbanColumn
                title="To Do"
                tasks={tasks?.todo}
                column="todo"
                moveTask={moveTask}
                color="bg-blue-600"
                handleViewTask={handleViewTask}
                onDelete={handleDelete}
              />
              <KanbanColumn
                title="In Progress"
                tasks={tasks?.inProgress}
                column="inProgress"
                moveTask={moveTask}
                color="bg-yellow-600"
                handleViewTask={handleViewTask}
                onDelete={handleDelete}
              />
              <KanbanColumn
                title="Review"
                tasks={tasks?.review}
                column="review"
                moveTask={moveTask}
                color="bg-purple-600"
                handleViewTask={handleViewTask}
                onDelete={handleDelete}
              />
              <KanbanColumn
                title="Done"
                tasks={tasks?.done}
                column="done"
                moveTask={moveTask}
                color="bg-green-600"
                handleViewTask={handleViewTask}
                onDelete={handleDelete}
              />
              <KanbanColumn
                title="Published"
                tasks={tasks?.published}
                column="published"
                moveTask={moveTask}
                color="bg-gray-700"
                handleViewTask={handleViewTask}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen && !selectedTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        users={users}
        currentUser={loggedInUser}
      />

      <ViewTaskModal
        show={isModalOpen && selectedTask}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={{ handleViewTask }}
        task={selectedTask}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </DndProvider>
  );
};

export default DashboardPage;
