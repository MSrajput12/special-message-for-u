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

// Save or update response
app.post('/api/save-response', async (req, res) => {
  try {
    const { userName, buttonClicked } = req.body;
    const collection = db.collection('responses');

    let existing = await collection.findOne({ userName });

    // NEW USER
    if (!existing) {
      const newData = {
        userName,
        buttonClicked,
        yesClickCount: buttonClicked === "YES" ? 1 : 0,
        noClickCount: buttonClicked === "NO" ? 1 : 0,
        createdAt: new Date(),
        timestamp: new Date()
      };

      await collection.insertOne(newData);
      return res.status(201).json({ success: true, message: "Record created!", data: newData });
    }

    // EXISTING USER
    let updateOps = {
      $set: { buttonClicked, timestamp: new Date() },
      $inc: {}
    };

    if (buttonClicked === "YES") updateOps.$inc.yesClickCount = 1;
    if (buttonClicked === "NO") updateOps.$inc.noClickCount = 1;

    // FIX: if fields DO NOT EXIST (undefined), then create them
    if (existing.yesClickCount === undefined) updateOps.$set.yesClickCount = 0;
    if (existing.noClickCount === undefined) updateOps.$set.noClickCount = 0;

    await collection.updateOne({ userName }, updateOps);

    res.status(200).json({ success: true, message: "Record updated!" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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

async function deleteResponse(id) {
  // UI se row turant hata do
  const row = document.querySelector(`[data-id="${id}"]`);
  if (row) row.remove();

  // Backend delete silently
  try {
    await fetch(`${API_URL}/response/${id}`, { method: "DELETE" });
  } catch (e) {
    console.error("Delete error:", e);
  }
}


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