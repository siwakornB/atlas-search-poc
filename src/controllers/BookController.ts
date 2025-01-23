import express, { Request, Response } from 'express';
import BookService from '../services/bookService';

const bookController = express.Router({mergeParams: true});
const bookService = new BookService()

bookController.get('/alter', async (req: Request, res: Response) => {
  bookService.findAllAlter(req, res)
});

bookController.get('/vector', async (req: Request, res: Response) => {
  bookService.findAllVector(req, res)
});

// Get a book by ID (READ - single)
bookController.get('/:id', async (req: Request, res: Response) => {
  bookService.findById(req, res)
});

// Get all books (READ - all)
bookController.get('/', async (req: Request, res: Response) => {
  bookService.findAll(req, res)
});

// Create a new book (CREATE)
bookController.post('/', async (req: Request, res: Response) => {
  bookService.create(req, res)
});

// Update a book by ID (UPDATE)
bookController.patch('/:id', async (req: Request, res: Response): Promise<any> => {
  bookService.update(req, res)
});

// clear all (DELETE)
bookController.delete('/clear', async (req: Request, res: Response): Promise<any> => {
  bookService.clearAll(req, res)
});

// Delete a book by ID (DELETE)
bookController.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  bookService.deleteById(req, res)
});
  

export default bookController;
