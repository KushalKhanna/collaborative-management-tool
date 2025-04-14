const express = require('express');
const router = express.Router();
const connectToDb = require('../db/mongoClient');
const bcrypt = require('bcrypt');

const dbName = 'cs211';
const collectionName = 'users';

router.get('/get-all-users', async (req, res) => {
  try {
    const client = await connectToDb();
    const db = client.db(dbName);
    const usersCollection = db.collection(collectionName);
    const entries = await usersCollection.find({}).toArray();

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch entries." });
  }
});

router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const client = await connectToDb();
    const db = client.db(dbName);
    const usersCollection = db.collection(collectionName);

    const user = await usersCollection.findOne({ userName });
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', name: user.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// SIGN UP
router.post('/signup', async (req, res) => {
  const { name, userName, password } = req.body;

  if (!name || !userName || !password) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await connectToDb();
    const db = client.db(dbName);
    const usersCollection = db.collection(collectionName);

    const existingUser = await usersCollection.findOne({ userName });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const newUser = {
      name,
      userName,
      password: hashedPassword,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully! ' + result});
  } catch (err) {
    res.status(500).json({ error: 'Error creating user!' });
  }
});


module.exports = router;
