import express, { Request, Response } from 'express';
import { Author, IAuthor } from '../models/Author';

const authorController = express.Router({mergeParams: true});

// Get a author by ID (READ - single)
authorController.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('trigger ', req.params);
    const author = await Author.findById({_id: req.params.id});
    if (!author) return res.status(404).json({ message: 'author not found' });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching author', error });
  }
});

// Get all authors (READ - all)
authorController.get('/', async (req: Request, res: Response) => {
    try {
      const authors = await Author.find();
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching authors', error });
    }
});


// Create a new author (CREATE)
authorController.post('/', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const newauthor: IAuthor = new Author({ name });
      await newauthor.save();
      res.status(201).json(newauthor);
    } catch (error) {
        console.log('error', error);
      res.status(400).json({ message: 'Error creating author', error });
    }
});

// Update a author by ID (UPDATE)
authorController.patch('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!author) return res.status(404).json({ message: 'author not found' });
    res.status(200).json(author);
  } catch (error) {
    res.status(400).json({ message: 'Error updating author', error });
  }
});

// Delete a author by ID (DELETE)
authorController.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'author not found' });
    res.status(200).json({ message: 'author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting author', error });
  }
});

const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
};
  

export default authorController;
