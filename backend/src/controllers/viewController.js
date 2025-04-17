module.exports = function(io) {
    const express = require('express');
    const router = express.Router();
    const connectToDb = require('../db/mongoClient');
    const { ObjectId } = require('mongodb');
  
    const dbName = 'cs211';
    const collectionName = 'views';
  
    /*
    let currentTicketNumber = 1;
  
    const getNextTicketNumber = () => {
      const formatted = `TKT-${String(currentTicketNumber).padStart(4, '0')}`;
      currentTicketNumber++;
      return formatted;
    };
  
    // GET ALL STORIES
    router.get('/get-all-tasks', async (req, res) => {
      try {
        const client = await connectToDb();
        const db = client.db(dbName);
        const tasksCollection = db.collection(collectionName); 
        const entries = await tasksCollection.find({}).toArray();
    
        res.json(entries);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch entries." });
      }
    });

    */
  
  // CREATE View
  
  
    /*
    // UPDATE STORY
  router.put('/update/:taskId', async (req, res) => {
    const { taskId } = req.params;
    let updatedData = req.body;
    
    try {
        // Remove _id from updatedData if it exists to prevent modification
        if (updatedData._id) {
            updatedData = { ...updatedData };
            delete updatedData._id;
        }
  
        const client = await connectToDb();
        const db = client.db(dbName);
        const tasksCollection = db.collection(collectionName);
  
        const currentTask = await tasksCollection.findOne({ 
            _id: new ObjectId(taskId) 
        });
  
        if (!currentTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
  
        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: updatedData }
        );
  
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
  
        const updatedTask = await tasksCollection.findOne({ 
            _id: new ObjectId(taskId) 
        });
  
        // Only emit if status changed
        if (updatedData.status && updatedData.status !== currentTask.status) {
            io.emit('task-moved', {
                taskId,
                oldStatus: currentTask.status,
                newStatus: updatedData.status,
                updatedTask
            });
        }
  
        // Also emit general update event
        io.emit('task-updated', updatedTask);
  
        res.json({ 
            message: 'Task updated successfully', 
            updatedTask
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });
  
    // DELETE STORY
    router.delete('/delete/:taskId', async (req, res) => {
      const { taskId } = req.params;
    
      try {
        const client = await connectToDb();
        const db = client.db(dbName);
        const tasksCollection = db.collection(collectionName);
    
        const taskToDelete = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
  
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Task not found or already deleted' });
        }
  
        io.emit('task-deleted', { 
          taskId,
          previousStatus: taskToDelete.status 
        });
    
        res.json({ message: 'Task deleted successfully' });
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    */
  
    return router;
  };