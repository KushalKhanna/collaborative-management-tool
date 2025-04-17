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
import io from 'socket.io-client';
//
import { useNavigate } from 'react-router-dom';



const socket = io('http://localhost:5000');

const DashboardPage = () => {
  const loggedInUser = sessionStorage.getItem('loggedInUser');
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
  const [selectedTag, setSelectedTag] = useState(''); 
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [otherLoggedInUser, setOtherLoggedInUsers] = useState([]);
  const [currentOpenTaskId, setCurrentOpenTaskId] = useState();
  //
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
          done: [],
          published: []
        };

        allTasks.forEach(task => {
          const status = task.status || 'todo';
          if (grouped[status]) {
            grouped[status].push(task);
          }
        });

        setFilteredTasks(null);
        setSelectedTag('');
        setTasks(grouped);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const clearFilter = () => {
    setFilteredTasks(null);
    setSelectedTag('');
  }

  const moveTask = async (fromColumn, toColumn, taskId) => {
    if (fromColumn === 'published') {
      toast.error('You cannot move tasks out of the Published column.');
      return;
    }
    
    if (fromColumn === toColumn) return;

    console.log(toColumn);
  
    const taskToMove = tasks[fromColumn]?.find(task => task._id === taskId);
    if (!taskToMove) return;
  
    try {
      await axios.put(`http://localhost:5000/api/tasks/update/${taskId}`, {
        status: toColumn
      });
  
      if (selectedTag && filteredTasks){
        setFilteredTasks(prev => ({
          ...prev,
          [fromColumn]: prev[fromColumn].filter(task => task._id !== taskId),
          [toColumn]: [...prev[toColumn], { ...taskToMove, status: toColumn }]
        }));
      }
    } catch (err) {
      console.error("Failed to move task:", err);
    }
  };

  const handleDelete = (deletedId, fromColumn) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [fromColumn]: prevTasks[fromColumn].filter(task => task._id !== deletedId)
    }));
    if (selectedTag && filteredTasks){
      setFilteredTasks(prev => ({
        ...prev,
        [fromColumn]: prev[fromColumn].filter(task => task._id !== deletedId)
      }));
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
  };

  const handleCreateTask = async (taskData) => {
    try {
      
      const response = await axios.post('http://localhost:5000/api/tasks/create', taskData);
      console.log('Task Created:', response.data);

      setFilteredTasks(null);
      setSelectedTag('');

      toast.success('Task created successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  };

  const filterTasksByTags = () => {
    if (!selectedTag) return;

    const grouped = {
      todo : [],
      inProgress : [],
      review : [],
      done : [],
      published: []
    };
    Object.keys(tasks).forEach(status => {
      console.log("Status:", status, "Tasks:", tasks[status], "sELECTED tag:", selectedTag);
      grouped[status] = tasks[status].filter(tasks =>
        tasks.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
      console.log("Filtered:", grouped[status]);
    });

    setFilteredTasks(grouped);
  }

  const handleTaskUpdate = async (taskData) => {
    try {
      // Create a clean update object without React references
      console.log(taskData);
      const cleanUpdate = {
        userId : loggedInUser,
        title: taskData.title,
        description: taskData.description,
        tags: taskData.tags,
        assignee: taskData.assignee,
        label: taskData.label,
        status: taskData.status,
        // Include only plain data, no functions or React elements
        ...(taskData.snapshots && { snapshots: taskData.snapshots })
      };
      console.log(taskData._id);
      console.log(loggedInUser);
      let response;
      if(taskData._id) {

        
        response = await axios.put(
        `http://localhost:5000/api/tasks/update/${taskData._id}`,
        cleanUpdate
      );
    }
  
    if (response?.data?.updatedTask) {
      toast.success('Task updated successfully!');
    }
      return response?.data.updatedTask;
      
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
      throw error;
    }
  };

  const handleAddView = (storyid) => {
    console.log(storyid);
    const data = {
        storyid
    };
    setLoading(true);
    axios
      .post('http://localhost:5000/addview', data)
      .then(() => {
        setLoading(false);
        //navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert('Sadly an error has occurred :(');
        console.log(error);
      });
      console.log("view added 2");
  };

  // CLICK VIEW TASK
  const handleViewTask = async (taskData) => {
    console.log(taskData);
    handleAddView(taskData._id);
    setSelectedTask(taskData);
    setIsModalOpen(true);

    // Websocket conn for view task
    socket.emit('task-viewed', {
      taskId: taskData._id,
      userId: loggedInUser
    });
  };

  // WEBSOCKETS
  useEffect(() => {

    // Create task listener
    socket.on('task-created', (newTask) => {
      console.log('New task received via socket:', newTask);
      setTasks(prev => ({
        ...prev,
        todo: [...prev.todo || [], newTask]
      }));
    });

    // Delete task listener
    socket.on('task-deleted', ({ taskId, previousStatus }) => {
      setTasks(prev => ({
        ...prev,
        [previousStatus]: prev[previousStatus].filter(task => task._id !== taskId)
      }));
    });

    // Move task listener
    socket.on('task-moved', ({ taskId, oldStatus, newStatus, updatedTask }) => {
      setTasks(prev => {
        // Create a new state object
        const newState = { ...prev };
        
        // Remove from old column (if it exists there)
        if (newState[oldStatus]) {
          newState[oldStatus] = newState[oldStatus].filter(task => task._id !== taskId);
        }
        
        // Add to new column (if not already present)
        if (newState[newStatus] && !newState[newStatus].some(t => t._id === taskId)) {
          newState[newStatus] = [...newState[newStatus], updatedTask];
        }
        
        return newState;
      });
    });

    // View/Edit tasks
    socket.on('task-viewed', ({ taskId, userId }) => {
      // Only show for other users
      if (userId !== loggedInUser) {
        console.log("HI - Task", taskId, "was clicked by another user" + " userId : " + userId);
        setOtherLoggedInUsers(prev => 
          prev.includes(userId) ? prev : [...prev, userId]
        );
        setCurrentOpenTaskId(taskId);
      }
    });

    socket.on('task-view-ended', ({ taskId }) => {
      setCurrentOpenTaskId(null); // This will remove the spinner
    });

    // 
    socket.on('task-updated', (updatedTask) => {
      // Update state without showing toast
      setTasks(prev => {
        const newTasks = {...prev};
        Object.keys(newTasks).forEach(col => {
          newTasks[col] = newTasks[col].filter(t => t._id !== updatedTask._id);
        });
        if (newTasks[updatedTask.status]) {
          newTasks[updatedTask.status].push(updatedTask);
        }
        return newTasks;
      });
    });
  
    // Clean up on unmount
    return () => {
      socket.off('task-created');
      socket.off('task-viewed');
      socket.off('task-moved');
      socket.off('task-deleted');

      socket.off('task-being-viewed');
      socket.off('task-view-ended');

      socket.off('task-updated')
    };
  }, [loggedInUser]);

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
                  Create 
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded" onClick={filterTasksByTags}>
                  Filter
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded" onClick={clearFilter}>
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* Main Content - Kanban Board */}
          <div className="flex-1 overflow-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Project Board</h1>
            <div className="p-6">
            <div className='dropdown-container'>
              <label className='block mb-2 font-semibold'>Filter by Story Type:</label>
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="b-full p-2 w-1/2 m-4 border-2 rounded-lg bg-gray-50 text-black focus:border-blue-500 font-bold "
              >
                <option value="">Select a tag</option>
                <option value="drama">🎭 Drama</option>
                <option value="comedy">😂 Comedy</option>
                <option value="action">🎬 Action</option>
                <option value="fantasy">🧙 Fantasy</option>
                <option value="mystery">🕵️ Mystery</option>
                <option value="horror">🧟 Horror</option>
                <option value="adventure">🎩 Adventure</option>
              </select>
            </div>
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
              {['todo', 'inProgress', 'review', 'done', 'published'].map(col => (
                <KanbanColumn
                  key={col}
                  title={col === 'inProgress' ? 'In Progress' : col.charAt(0).toUpperCase() + col.slice(1)}
                  tasks={(filteredTasks || tasks)?.[col]}
                  column={col}
                  moveTask={moveTask}
                  color={
                    col === 'todo' ? 'bg-blue-600' :
                    col === 'inProgress' ? 'bg-yellow-600' :
                    col === 'review' ? 'bg-purple-600' :
                    col === 'done' ? 'bg-green-600' :
                    'bg-gray-700'
                  }
                  handleViewTask={handleViewTask}
                  onDelete={handleDelete}
                  otherLoggedInUser={otherLoggedInUser}
                  currentOpenTaskId={currentOpenTaskId}
                />
              ))}
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
          if (selectedTask) {
            socket.emit('task-view-ended', { 
              taskId: selectedTask._id,
              userId: loggedInUser
            });
          }
        }}
        onSubmit={{ handleViewTask }}
        task={selectedTask}
        socket={socket}
        loggedInUser={loggedInUser}
        users={users}
        onUpdate={handleTaskUpdate}
      />

{/* {showConfirm && (
        <ConfirmationModal
          title="Confirm Move"
          message="Are you sure you want to move this task to Published? This action cannot be undone."
          onConfirm={confirmMove}
          onCancel={cancelMove}
        />
      )} */}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </DndProvider>
  );
};

export default DashboardPage;