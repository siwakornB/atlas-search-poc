import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import router from './route';
import authorController from './controllers/AuthorController';
import bookController from './controllers/BookController';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
// app.use('/api', router);
app.use('/authors', authorController);
app.use('/books', bookController);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
