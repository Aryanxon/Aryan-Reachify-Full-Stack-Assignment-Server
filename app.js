const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./Controller/Database');
const Signup = require('./Controller/Signup');
const PORT = 3000;
const cors = require('cors');
const secretKey = 'yourSecretKey';
const jwt = require('jsonwebtoken');


require('dotenv').config();



app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));



  function generateToken(userId) {
    const payload = {
        userId: userId, // Add any information you want to include in the token
    };
    
    
    // Generate token
    const token = jwt.sign(payload, secretKey);
    
    return token;
}





  app.post('/users', async (req, res) => {
    try {
      const { name,  } = req.body;
      const authHeader = req.headers.authorization;

      const token = authHeader.split(" ")[1]; // Extract the token

        const decoded = jwt.verify(token, secretKey); // Replace with your secret key
        if (!name || name.trim() === '') {
          return res.status(400).json({ message: 'Item name is required' });
        }
    
        // Save item to database
        const newItem = new User({ name });
        await newItem.save();
    
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    
  
      // Validate input
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });





  app.get('/Show', async (req, res) => {
    try {
      // Fetch all users
      const authHeader = req.headers.authorization;

      const token = authHeader.split(" ")[1]; // Extract the token

      const decoded = jwt.verify(token, secretKey); // 
      const users = await User.find();
  
      if (!users || users.length === 0) {
        return res.status(200).json({ message: 'No users found', users: [] });
      }
  
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', users: [] });
    }
  });



  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const authHeader = req.headers.authorization;

      const token = authHeader.split(" ")[1]; // Extract the token

      const decoded = jwt.verify(token, secretKey); // 
      const deletedItem = await User.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });




  // Signup 
  app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input
      if (!username || username.trim() === '' && !password || password.trim() === '') {
        return res.status(400).json({ message: 'Signup details is required' });
      }
      const token = generateToken({username, password});
  
      // Save item to database
      const newItem = new Signup({ username, password, token  });
      await newItem.save();
  
      res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });



  // login 

  app.post('/Login', async (req, res) => {
    const { username, password, token } = req.body;
  
    if (!username || !password || !token) {
      return res.status(400).json({ message: 'Username, password, and token are required' });
    }
  
    // Verify the JWT token
    try {
      const user = await User.findOne({ username, password, token  });
      if (user) {
        res.send({message: "USer credential matches",username })
      }
      
    } catch (error) {
      console.error('Error finding user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  
    
  });








app.get('/', (req, res) => {
    res.send('MongoDB connected!');
  });





// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});