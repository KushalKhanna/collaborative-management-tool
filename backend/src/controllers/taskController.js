const express = require('express');
const router = express.Router();
const connectToDb = require('../db/mongoClient');
const { ObjectId } = require('mongodb');

const dbName = 'cs211';
const collectionName = 'stories';

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

// CREATE STORY
router.post('/create', async (req, res) => {
  const { title, description, tags, assignee, label, reporter } = req.body;

  try {
    const client = await connectToDb();
    const db = client.db(dbName);
    const tasksCollection = db.collection(collectionName); 

    if (!title || !assignee || !reporter) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const ticketNumber = getNextTicketNumber();

    const newTask = {
        title, 
        description, 
        tags, 
        assignee, 
        label, 
        reporter,
        ticketNumber,
        status: 'todo',
        createdAt: new Date()
    };

    const result = await tasksCollection.insertOne(newTask);

    res.status(201).json({ message: 'User story created successfully! ', result: result});
  } catch (err) {
    res.status(500).json({ error: 'Error creating user story!' });
  }
});

// UPDATE STORY
router.put('/update/:taskId', async (req, res) => {
    console.log('Hi');
    const { taskId } = req.params;
    const updatedData = req.body;
    console.log(taskId);

    
  
    try {
      const client = await connectToDb();
      const db = client.db(dbName);
      const tasksCollection = db.collection(collectionName);

      const task = await tasksCollection.find({ _id: new ObjectId(taskId) });
      console.log(task);
  
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: updatedData }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json({ message: 'Task updated successfully', updatedCount: result.modifiedCount });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


module.exports = router;
