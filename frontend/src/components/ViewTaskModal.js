import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ViewTaskModal = ({ show, onClose, task, onUpdate, users = [], onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [assignee, setAssignee] = useState('');
  const [label, setLabel] = useState('');
  const [reporter, setReporter] = useState('');
  const [status, setStatus] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');

  const [snapshots, setSnapshots] = useState([]);
  const storyBox = useRef(null);
  const [story, setStory] = useState("");
  const previousStory = useRef("");
  const [snapToDisplayLinks, setSnapToDisplayLinks] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState("");
  const [canDisplayLinks, setCanDisplayLinks] = useState(false);
  const [canSeeSnapshots, setCanSeeSnapshots] = useState(false);
  const loggedInUser = sessionStorage.getItem('loggedInUser');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    console.log("in viewtaskmodal");
    if (task) {

      console.log(task);

      console.log(loggedInUser);
    const data = {
        storyid : task._id,
        userid : loggedInUser
    };
    setLoading(true);
    axios
      .post('http://localhost:5000/api/tasks/addview', data)
      .then(() => {
        setLoading(false);
        //navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert('Sadly an error has occurred :(');
        console.log(error);
      });


      setTitle(task.title || '');
      setDescription(task.description || '');
      setTags(task.tags || '');
      setAssignee(task.assignee || '');
      setLabel(task.label || '');
      setReporter(task.reporter || '');
      setStatus(task.status || '');
      setTicketNumber(task.ticketNumber || '');
      setSnapshots(task.snapshots || []);
      setCanSeeSnapshots(false); 
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      title,
      description,
      tags,
      assignee,
      label,
      reporter,
      snapshots,
      status,
      ticketNumber
    };

    onUpdate(updatedTask);
    onClose();
  };

  //from CreateTaskModal
  const getSelectedTextRange = () => {
    if (storyBox.current) {
      //gets the start and end of hightlighted area
      const textarea = storyBox.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const links = [];
  
      console.log(`Selected text starts at ${start} and ends at ${end}`);

      //concatonates the new snapshot to end of snapshots array
      setSnapshots(prev => [...prev, { start, end, links }]);

      return { start, end };
    }
    return { start: null, end: null };
  };

  //called to increase the indexs all relevant start/end points in a snapshot
  //this is so they stay in sync even if the user adds extra characters later
  const increaseSnapshots = (index) => {
    const updated = snapshots.map(({ start, end }) => ({
      start: start > index ? start + 1 : start,
      end: end > index ? end + 1 : end
    }));
    setSnapshots(updated);
  };

  //called to decrease the indexs all relevant start/end points in a snapshot
  //this is so they stay in sync even if the user deletes characters
  const decreaseSnapshots = (index) => {
      const updated = snapshots.map(({ start, end }) => ({
        start: start > index ? start - 1 : start,
        end: end > index ? end - 1 : end
      }));
      setSnapshots(updated);
    };

  const handleStoryChange = (e) => {
    //Snap shots are stored as a start index and end index
    //This function's job is to incerase/ decrease those index's as the user types and deletes character
    //This allows the index's to stay in sync w/ the intended text
    const newValue = e.target.value;
    const oldValue = previousStory.current;
  
    let changedIndex = -1;
  
    // Determine if it was an insertion or deletion
    if (newValue.length > oldValue.length) {
      // Character added
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] !== oldValue[i]) {
          changedIndex = i;
          console.log(`Character added at index: ${changedIndex}`);

          increaseSnapshots(changedIndex);
        
          break;
        }
      }
    } else if (newValue.length < oldValue.length) {
      // Character deleted
      for (let i = 0; i < oldValue.length; i++) {
        if (newValue[i] !== oldValue[i]) {
          changedIndex = i;
          console.log(`Character deleted at index: ${changedIndex}`);

          decreaseSnapshots(changedIndex);
          break;
        }
      }

  
      // If entire end was deleted
      if (changedIndex === -1) {
        changedIndex = newValue.length;
        console.log(`Character deleted at index: ${changedIndex}`);

        decreaseSnapshots(changedIndex);
      }
    }

    setStory(newValue);
    previousStory.current = newValue;
  };

  

  const handleAddLink = () => {
    if (url.trim()) {

      let removeStart = url.trim();

      // Add protocol if missing
      //Otherwise the website will try and concatonate the link to this website's address
      if (!/^https?:\/\//i.test(removeStart)) {
        removeStart = `https://${removeStart}`;
      }
      
      //create a temp snapshot
      const updatedSnap = {

        start: snapToDisplayLinks.start,
        end: snapToDisplayLinks.end,
        links: [...snapToDisplayLinks.links || [], removeStart]

      }

      //set the snapshot that we are currently displaying the links for equal to the temp snap
      setSnapToDisplayLinks(updatedSnap);
      
      //also use the temp snap to array of all snapshots
      setSnapshots([
          
        ...snapshots.slice(0, currentSnapshotIndex),
        updatedSnap,
        ...snapshots.slice(currentSnapshotIndex + 1)

      ]);
      
      //clear the link textbox, so it is blank for the next link
      setUrl("");
    }
  };

  const handleDeleteLink = (indexToDelete) => {
    const updatedLinks = snapToDisplayLinks.links.filter((_, index) => index !== indexToDelete);
  
    const updatedSnap = {
      ...snapToDisplayLinks,
      links: updatedLinks
    };
  
    setSnapToDisplayLinks(updatedSnap);
  
    setSnapshots([
      ...snapshots.slice(0, currentSnapshotIndex),
      updatedSnap,
      ...snapshots.slice(currentSnapshotIndex + 1)
    ]);
  };

  //Snapshot functionality is conditionally rendered based on "canSeeSnapshots"
  //Called when "displayHideSnaps" button is pressed
  //Flips boolean of canSeeSnapshots
  const flipCanSeeSnapshots = () => {

    const newValue = !canSeeSnapshots;
    setCanSeeSnapshots(newValue);

    //changes text on "displayHideSnaps" button to appropriate value
    const button = document.getElementById("displayHideSnaps");
    if (button) {
      button.innerText = newValue ? "Hide Snapshots" : "Show Snapshots";
    }
  }

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
              ref={storyBox}
              
              onChange={e => {
                setDescription(e.target.value);
                /*below function is used to check if the start/end of
                any existing snapshots need to be updated to account
                for new characters added or deleted
                */
                handleStoryChange(e);
              }}

              className="w-full p-2 border rounded"
              rows={5}
            />
            <select
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a tag</option>
                <option key = "drama" value="drama">🎭 Drama</option>
                <option key = "comedy" value="comedy">😂 Comedy</option>
                <option key = "action" value="action">🎬 Action</option>
                <option key = "fantasy" value="fantasy">🧙 Fantasy</option>
                <option key = "mystery" value="mystery">🕵️ Mystery</option>
                <option key = "horror" value="horror">🧟 Horror</option>
                <option key = "adventure" value="adventure">🎩 Adventure</option>
              </select>
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
                <option value="inProgress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

        

          {/* Update Button */}
          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              onClick={onUpdate}
            >
              Update
            </button>
          </div>
        </form>
        {/* Snapshot selection*/}
        {/* Button to show / hides snapshots */}
        <button type="button" id="displayHideSnaps" className="w-full bg-zinc-100 hover:bg-blue-100 py-2 px-4 rounded" onClick={flipCanSeeSnapshots}>Display Snapshots</button>
        <div>
        {canSeeSnapshots && (
        <div className="snapshots-section">
            <label className="text-xl font-bold mb-4">Snapshots</label>
            <br></br>
            <button type="button" className="w-full bg-zinc-100 hover:bg-blue-100 py-2 px-4 rounded" onClick={getSelectedTextRange}>Create Snapshot</button>
            <table className="table-fixed w-full border-collapse border border-gray-400">
                        <thead>
                            <tr>
                              <th class="w-[10%] border border-gray-300 px-2 py-2 text-left">No.</th>
                              <th class="w-[120%] border border-gray-300 px-2 py-2 text-left">Snapshot</th>
                              <th class="w-[10%] border border-gray-300 px-2 py-2 text-left">Go To</th>
                              <th class="w-[10%] border border-gray-300 px-2 py-2 text-left">Delete</th>
                              <th class="w-[20%] border border-gray-300 px-2 py-2 text-left">Links</th>
                            </tr>
                        </thead>
                        <tbody>
                            {snapshots.map((snapshot, index) => {
                            //const text = storyBox.current?.value || '';
                            const tempText = description;
                            const text = storyBox.current?.value ?? task.description;
                            const snap = text.substring(snapshot.start, snapshot.end);

                            const goToCursor = () => {
                              {/*Takes cursor to start of snapshot*/}
                                if (storyBox.current) {
                                  storyBox.current.focus();
                                  storyBox.current.setSelectionRange(snapshot.start, snapshot.start);
                                  storyBox.current.scrollTop = storyBox.current.scrollHeight * (snapshot.start / text.length);
                                }
                              };


                            const deleteSnapshot = () => {
                                setSnapshots(prev => {
                                  const updated = [...prev];
                                  updated.splice(index, 1);
                                  return updated;
                                });
                            
                            };

                            const showLinks = () => {
                              {/*Only 1 "set" of links are displayed at once*/}
                              {/*This sets the snapshot for which we want to display links*/}
                              console.log("showLinks");
                              setSnapToDisplayLinks(snapshots[index]);
                              setCurrentSnapshotIndex(index);
                              console.log(snapToDisplayLinks);
                              setCanDisplayLinks(true);
                            };
                              

                            return (
                                <tr key={index}>
                                <td 
                                  className="border border-gray-300 px-2 py-2 break-words whitespace-normal"
                                >{index + 1}</td>
                                <td
                                  className="border border-gray-300 px-2 py-2 break-words whitespace-normal"
                                ><pre>{snap}</pre></td>
                                <td
                                  className="border border-gray-300 px-2 py-2 break-words whitespace-normal"
                                >
                                    <button type="button" onClick={goToCursor}>Go To</button>
                                    
                                </td>
                                <td
                                  className="border border-gray-300 px-2 py-2 break-words whitespace-normal"
                                >
                                  <button type="button" onClick={deleteSnapshot}>Delete</button>
                                </td>
                                <td
                                  className="border border-gray-300 px-2 py-2 break-words whitespace-normal"
                                >
                                    <button type="button" onClick={showLinks}>Show Links</button>
                                </td>
                                
                                {/*
                                <td>
                                {links[index] && (
                                    <a href={links[index]} target="_blank" rel="noopener noreferrer">
                                    {links[index]}
                                    </a>
                                )}
                                </td>

                                */}
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>

                    {/* Table for displaying links */}
                    
                    <br></br>
                    {canDisplayLinks && (
                    <div class="links-class">
                    <label className="block mb-1 font-semibold">Add Links</label>
                    {/*Box to type link into*/}
                    <input
                      className="w-full p-2 border rounded"
                      type="text"
                      placeholder="URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      style={{ marginRight: "8px" }}
                    />
                    <button className="w-full bg-zinc-100 hover:bg-blue-100 py-2 px-2 rounded" type="button" onClick={handleAddLink}>Save Link</button>
                    <br></br>
                    <table className="table-fixed w-full border-collapse border border-gray-400">
                      <thead>
                        <tr>
                          <th class="w-[90%] border border-gray-300 px-2 py-2 text-left">All Links</th>
                          <th class="w-[10%] border border-gray-300 px-2 py-2 text-left">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {snapToDisplayLinks.links?.map((link, index) => (
                          <tr key={index}>
                            <td
                              className="border border-gray-300 px-2 py-2 break-words whitespace-normal"
                            ><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></td>
                            <td
                              
                            >
                              <button onClick={() => handleDeleteLink(index)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                    )}
                </div>
                )}
          </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
