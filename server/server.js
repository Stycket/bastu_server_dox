import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { DateTime } from 'luxon'; // Import Luxon's DateTime
import cron from 'node-cron';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



const uri = process.env.MONGODB_URL; // Replace with your MongoDB Atlas connection string
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
      const user_name = req.body.name; // Simulated user

      
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
         timeSlot: selectedTimeSlot,
         name: user_name,
       };
   
       const insertResult = await collection.insertOne(bookingData);
       console.log('Booking inserted:', insertResult.insertedId);


    });




// Function to remove items from the previous month
// Function to remove items that are 3 months old 
async function removeItemsThreeMonth() {
  try {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const db = client.db(); // Use your existing client and database
    const collection = db.collection('sauna_collection'); // Replace with your collection name

    // Create a filter to find documents from yesterday
    const filter = {
      date: formatDate(yesterday), // Specify the date from yesterday
    };

    // Remove documents that match the filter
    const result = await collection.deleteMany(filter);

    console.log(`${result.deletedCount} document(s) removed from yesterday [Auto].`);
  } catch (error) {
    console.error('An error occurred while removing documents:', error);
  }
}





async function removeDocumentsFromYesterday() {
  try {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const db = client.db(); // Use your existing client and database
    const collection = db.collection('sauna_collection'); // Replace with your collection name

    // Create a filter to find documents from yesterday
    const filter = {
      date: formatDate(yesterday), // Specify the date from yesterday
    };

    // Remove documents that match the filter
    const result = await collection.deleteMany(filter);

    console.log(`${result.deletedCount} document(s) removed from yesterday [On server start]`);
  } catch (error) {
    console.error('An error occurred while removing documents:', error);
  }
}

function formatDate(date) {
  const month = date.getMonth() + 1; // Adjusting for 0-based index
  const day = date.getDate();
  return `${month} / ${day}`;
}

// To remove documents from yesterday
removeDocumentsFromYesterday();



// Schedule the task to run at 00:55 each day
// Schedule the task to run at 01:05 each day in the Swedish timezone
cron.schedule('8 3 * * *', () => {
  // Adjust the timezone to Europe/Stockholm (Swedish timezone)
  const swedishTimezone = 'Europe/Stockholm';
  const swedishNow = new Date().toLocaleString('en-US', { timeZone: swedishTimezone });
  removeItemsThreeMonth();
});



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
