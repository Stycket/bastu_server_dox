import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { DateTime } from 'luxon'; // Import Luxon's DateTime

import cron from 'node-cron'; // Import node-cron

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://nurium:q2SvFGyNeYdSgP4X@saunacluster.wjfc1vm.mongodb.net/'; // Replace with your MongoDB Atlas connection string
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbName = 'sauna_booking';

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db(dbName);
    const bookingCollection = database.collection('bookings');

    app.post('/book', async (req, res) => {
      const selectedDate = req.body.date;
      const selectedTimeSlot = req.body.timeSlots;
      const user = req.body.user; // Simulated user

      console.log('Booking request received:', selectedDate, selectedTimeSlot, user);



      const db = client.db();
      const collection = db.collection('sauna_collection');
  
       // Check if the selected time slot is available
       const existingBooking = await collection.findOne({ date: selectedDate, timeSlot: selectedTimeSlot });
       if (existingBooking) {
         console.log('Selected time slot is already booked');
         return;
       }
   
       // Insert the booking
       const bookingData = {
         user: user,
         date: selectedDate,
         timeSlot: selectedTimeSlot
       };
   
       const insertResult = await collection.insertOne(bookingData);
       console.log('Booking inserted:', insertResult.insertedId);


    });






// Function to remove items from the previous month
// Function to remove items that are 3 months old 
async function removeItemsThreeMonth() {
  try {
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

    // Format the date 3 months ago in your custom format
    const formattedThreeMonthsAgo = `${threeMonthsAgo.getMonth() + 1} / ${threeMonthsAgo.getDate()}`;
    
    // Format today's date in your custom format
    const formattedToday = `${today.getMonth() + 1} / ${today.getDate() - 1}`;

    const db = client.db(); // Use your existing client and database
    const collection = db.collection('sauna_collection'); // Replace with your collection name

    // Create a filter to find items between yesterday and three months ago
    const filter = {
      date: {
        $gte: formattedThreeMonthsAgo, // Greater than or equal to three months ago in your custom format
        $lte: formattedToday, // Less than or equal to today in your custom format
      },
    };

    // Remove documents that match the filter
    const result = await collection.deleteMany(filter);

    console.log(`${result.deletedCount} document(s) removed that are up to 3 months old`);
  } catch (error) {
    console.error('An error occurred while removing items:', error);
  }
}



// Schedule the task to run at the start of each new month (1st day at midnight)
cron.schedule('0 0 1 * *', () => {
  removeItemsThreeMonth();
});

// Function to check and remove outdated items when the server starts
async function removeOutdatedItemsOnServerStart() {
  try {
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

    // Format the date 3 months ago in your custom format
    const formattedThreeMonthsAgo = `${threeMonthsAgo.getMonth() + 1} / ${threeMonthsAgo.getDate()}`;
    
    // Format today's date in your custom format
    const formattedToday = `${today.getMonth() + 1} / ${today.getDate() - 1}`;

    const db = client.db(); // Use your existing client and database
    const collection = db.collection('sauna_collection'); // Replace with your collection name

    // Create a filter to find items between yesterday and three months ago
    const filter = {
      date: {
        $gte: formattedThreeMonthsAgo, // Greater than or equal to three months ago in your custom format
        $lte: formattedToday, // Less than or equal to today in your custom format
      },
    };

    // Remove documents that match the filter
    const result = await collection.deleteMany(filter);

    console.log(`${result.deletedCount} document(s) removed that are 3 months old or older.`);
  } catch (error) {
    console.error('An error occurred while removing items:', error);
  }
}

// Run the function to remove outdated items when the server starts
removeOutdatedItemsOnServerStart();




// Grab all bookings

    

    
    app.post('/booked', async (req, res) => {
      try {
        // Set CORS headers to allow requests from https://bastu.webflow.io
    
        console.log('Sidan laddas och bokningar skickas');
        // Fetch booked items from the database and send them in the response
        const db = client.db();
        const collection = db.collection('sauna_collection');
    
        // Modify this logic to retrieve booked items
        const bookedItems = await collection.find({/* Your query here */}).toArray();
    
        res.json({ success: true, bookedItems });
      } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ success: false, error: 'An error occurred while fetching booked items.' });
      }
    });
    





// Grab user Bookings




    app.post('/bookedUser', async (req, res) => {
      try {
      
    
        console.log('Received a POST request for Bookings');
        // Fetch booked items from the database and send them in the response
        const db = client.db();
        const collection = db.collection('sauna_collection');
    
        // Modify this logic to retrieve booked items
        const bookedItems = await collection.find({/* Your query here */}).toArray();
    
        res.json({ success: true, bookedItems });
      } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ success: false, error: 'An error occurred while fetching booked items.' });
      }
    });
    




    // Unbook
    app.post('/unBook', async (req, res) => {
      try {
        const selectedDate = req.body.date;
        const selectedTimeSlot = req.body.timeSlots;
    
        // Format the selectedTimeSlot values to match MongoDB format
        const formattedTimeSlots = selectedTimeSlot.split('-').map(slot => slot + ':00');
    
        // Get the database and collection (assuming you already have them)
        const db = client.db(); // Use your existing client and database
        const collection = db.collection('sauna_collection'); // Replace with your collection name
    
        // Create a filter to find documents with matching date and formatted timeSlot
        const filter = {
          date: selectedDate,
          timeSlot: { $in: formattedTimeSlots }
        };
    
        // Remove documents that match the filter
        const result = await collection.deleteMany(filter);
    
        console.log(`${result.deletedCount} document(s) removed.`);
    
        res.json({ success: true });
      } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ success: false, error: 'An error occurred while removing booked items.' });
      }
    });
    

    
    


    




    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

startServer();
