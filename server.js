const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Middleware registration
app.use(cookieParser());
app.use(
  session({
    secret: 'key', // Replace this with your actual secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // Session expires after 1 hour (adjust as needed)
      httpOnly: true,
      secure: false, // Set to true in production when using HTTPS
    }, // Set secure to true if using HTTPS
  })
);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const port = 5000;

// Connection URL and database name
const uri = 'mongodb+srv://abhishekgowda0047:wnAU7ZCIj1W1l7xj@cluster0.qdhxfsv.mongodb.net/';
const dbName = 'test'; // Replace this with your actual database name
const client = new MongoClient(uri);

// Middleware to parse JSON requests
app.use(express.json());

const checkAuth = (req, res, next) => {
  if (req.session && req.session.username) {  
    console.log('User logged in:', req.session.username);
    // User is authenticated
    next();
  } else {
    // User is not authenticated, return an error
    res.status(401).json({ message: 'Not authenticated' });
  }
};

app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    // Connect to the MongoDB
    await client.connect();
    console.log('Connected to the database');
    // Select the database
    const db = client.db(dbName);

   const result= await db.collection('users').updateOne({username:author},{$addToSet:{post:[[title],[content]]}},{upsert:true});
   console.log(result);
   // await db.collection('users').updateOne({username:author},anewPost,{upsert:true});
    return res.json({ message: 'Added Post' });

  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
});


app.post('/api/dashboard', async (req, res) => {
  // Access the user ID from the session
 // console.log("gggggggg");
  const {username}=req.body;
  console.log(req.session);
  //console.log(username);
  try {
    // Connect to the MongoDB
    await client.connect();
    console.log('Connected to the database');

    // Select the database
    const db = client.db(dbName);

    // Find the user by ID
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return the user data
    res.json({ user });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Logging in user:', username);

  console.log('Connecting to the database...');
  try {
    // Connect to the MongoDB
    await client.connect();
    console.log('Connected to the database');

    // Select the database
    const db = client.db(dbName);

    // Find the user by username
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return res.json({ message: 'User not found' });
    }

    // Check if the password is correct
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result) {
        // Passwords match
        req.session.username = user.username;
        console.log('User logged in:', req.session.username);
        return res.json({ message: 'Login successful' });
      } else {
        // Passwords do not match
        return res.json({ message: 'Invalid password' });
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
});

// Example route for user signup
app.post('/api/signup', async (req, res) => {
  // Data received from the client
  const { username, password } = req.body;
  console.log('Received signup request:', req.body);

  console.log('Connecting to the database...');
  try {
    // Connect to the MongoDB
    await client.connect();
    console.log('Connected to the database');

    // Select the database
    const db = client.db(dbName);

    // Check if the username already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Save the user to the database
    await db.collection('users').insertOne(newUser);

    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
});
app.post('/api/deltposts', async (req, res) => {
  const {tit,content,author}=req.body;
 // const {author}=req.body;
  console.log(author);
  
  try {
    // Connect to the MongoDB
    await client.connect();
    console.log('Connected to the database');
    
    // Select the database
    const db = client.db(dbName);

    // Find the user by username
    const re=await db.collection('users').updateOne({ username: author},{ $pull: { post: {$in:[[tit[0]],[content[0]]]}}});
    console.log(re);
    return res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
