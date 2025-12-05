const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: true
});

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("loveProposalDB");
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

// API Routes

// Admin login/password check
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    const collection = db.collection('admin');
    
    // Get admin password from database
    let adminDoc = await collection.findOne({ type: 'admin' });
    
    // If no admin doc exists, create default password "king"
    if (!adminDoc) {
      adminDoc = { type: 'admin', password: 'king' };
      await collection.insertOne(adminDoc);
    }
    
    if (password === adminDoc.password) {
      res.status(200).json({
        success: true,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update admin password
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const collection = db.collection('admin');
    
    const adminDoc = await collection.findOne({ type: 'admin' });
    
    if (!adminDoc || adminDoc.password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    await collection.updateOne(
      { type: 'admin' },
      { $set: { password: newPassword } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Save user response
// Save or update user response
// Save or update user response
// Save or update response
app.post('/api/save-response', async (req, res) => {
  try {
    const { userName, buttonClicked } = req.body;
    const collection = db.collection('responses');

    // Try to find existing record for this user
    const existing = await collection.findOne({ userName });

    if (!existing) {
      // First click → create record
      const newData = {
        userName,
        buttonClicked,
        noClickCount: buttonClicked === "NO" ? 1 : 0,
        createdAt: new Date(),
        timestamp: new Date()
      };
      await collection.insertOne(newData);
      return res.status(201).json({
        success: true,
        message: "Record created!",
        data: newData
      });
    } else {
      // Update existing record
      const update = {
        $set: {
          buttonClicked,
          timestamp: new Date()
        }
      };

      if (buttonClicked === "NO") {
        update.$inc = { noClickCount: 1 }; // Increment NO count
      }

      const result = await collection.updateOne({ userName }, update);

      return res.status(200).json({
        success: true,
        message: "Record updated!",
        data: result
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});



// Get all responses (optional - for admin view)
app.get('/api/responses', async (req, res) => {
  try {
    const collection = db.collection('responses');
    const responses = await collection.find({}).sort({ createdAt: -1 }).toArray();

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message
    });
  }
});

// Get response by user name
app.get('/api/response/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    const collection = db.collection('responses');
    const response = await collection.findOne({ userName });

    if (response) {
      res.status(200).json({
        success: true,
        data: response
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response',
      error: error.message
    });
  }
});

// Delete response by ID
app.delete('/api/response/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = require('mongodb');
    
    const collection = db.collection('responses');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: 'Response deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete response',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await client.close();
  process.exit(0);
});