import { useState, useRef} from 'react';
import { X } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, users = [], currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [assignee, setAssignee] = useState('');
  const [label, setLabel] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const storyBox = useRef(null);
  const [story, setStory] = useState("");
  const previousStory = useRef("");
  const [snapToDisplayLinks, setSnapToDisplayLinks] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState("");
  const [canDisplayLinks, setCanDisplayLinks] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const taskData = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      assignee,
      label,
      reporter: currentUser || 'Unknown',
      snapshots,
    };

    onSubmit(taskData);
    setTitle('');
    setDescription('');
    setTags('');
    setAssignee('');
    setLabel('');
    setSnapshots([]);
    setCanDisplayLinks(false);
    onClose();
  };

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
    //This function's job is to incerase/ decrease those indexs as the user types and deletes character
    //This allows the indexs to stay in sync w/ the intended text
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


    //Only 1 "set" of links are displayed at once
    //This sets the snapshot for which we want to display links
    setSnapToDisplayLinks(updatedSnap);
  
    setSnapshots([
      ...snapshots.slice(0, currentSnapshotIndex),
      updatedSnap,
      ...snapshots.slice(currentSnapshotIndex + 1)
    ]);
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

        {/*
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        */}
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              ref={storyBox}
              value={description}
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
            <label className="block mb-1 font-semibold">Tags</label>
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
            {/*
              type="submit"
              */}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>

{/* Snapshot selection*/}
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
                            const text = storyBox.current?.value || '';
                            const snap = text.substring(snapshot.start, snapshot.end);

                            {/*Brings cursor to start index of snapshot when button is clicked*/}
                            const goToCursor = () => {
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

                            {/*Only 1 "set" of links are displayed at once*/}
                            {/*This sets the snapshot for which we want to display links*/}
                            const showLinks = () => {
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

      </div>

      
    </div>
  );
};

export default CreateTaskModal;
