import { Author, IAuthor } from "../models/Author";
import { Book, IBook } from "../models/Book"
import { Request, Response } from "express";


export default class BookService {
    tokenizerService: TokenizerService = new TokenizerService();

    public async findById(req: Request, res: Response): Promise<any> {
        try {
            const book = await Book.findById({_id: req.params.id})
            .populate('authors') // Populates the authors field with details
            if (!book) return res.status(404).json({ message: 'book not found' });
            res.status(200).json(book)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching book', error });
        }
    }

    public async findAll(req: Request, res: Response): Promise<any> {
      console.log('this is just find')
        try {
            const pipeline = [];
            let searchText = req.query.search;
            let yearStartStr = req.query.yearStart;
            let yearEndStr = req.query.yearEnd;
            
            if (!!searchText) {
              pipeline.push({
                $search: {
                // "index": "search_index",
                  index: "thai",
                  text: {
                    query: searchText,
                    path: ["description"],
                  },
                  highlight: {path: ["description"]},
                  "scoreDetails": true
                },
              },)
            }
      
            const currentYear = new Date().getFullYear()
            if (!!yearStartStr) {
              const yearStart = Number(yearStartStr)
              if (isNaN(+yearStart) || yearStart < 0) {
                res.status(400).json({ message: 'year start must be a positive number'})
                return
              }
              if (yearStart > currentYear) {
                res.status(400).json({ message: 'cannot specify year in the future'})
                return
              }
              pipeline.push({
                  $match: { 
                    year: { $gte: yearStart } 
                  }
              },)
            }
      
            if (!!yearEndStr) {
              const yearEnd = Number(yearEndStr)
              if (isNaN(+yearEnd) || yearEnd < 0) {
                res.status(400).json({ message: 'year end must be a positive number'})
                return
              }
              if (yearEnd > currentYear) {
                res.status(400).json({ message: 'cannot specify year in the future'})
                return
              }
              pipeline.push({
                $match: { 
                  year: { $lte: yearEnd } 
                }
            },)
            }
      
            // final of pipeline
            pipeline.push(
            {
              $project: {
                "name": 1,
                "year": 1,
                "description": 1,
                "authors": 1,
                "score": { "$meta": "searchScore" },
                "scoreDetails": {"$meta": "searchScoreDetails"},
                "highlights": { "$meta": "searchHighlights" },
              }
            },)
            // pipeline.push(
            //   {
            //   $limit: 5
            // })
            console.log(pipeline)
            // const books = await Book.find({})
            const books = await Book.aggregate(pipeline)
              // .populate('authors') // Populates the authors field with details
              .exec();
      
            await Author.populate(books, {path: "authors"});
            res.status(200).json(books);
          } catch (error) {
            res.status(500).json({ message: 'Error fetching books', error });
          }
    }

    public async findAllAlter(req: Request, res: Response): Promise<any> {
      console.log('this is new find')
        try {
            const pipeline = [];
            let searchText = req.query.search;
            let yearStartStr = req.query.yearStart;
            let yearEndStr = req.query.yearEnd;
            
            if (!!searchText) {
            const joinedQuery = (await this.tokenizerService.getTokenized(searchText.toString())).join(' ')
            console.log('joinedQuery', joinedQuery);
            pipeline.push({
                $search: {
                // "index": "search_index",
                    index: 'default',
                    text: {
                        query: joinedQuery,
                        path: ["alternativeDescription"],
                    },
                    highlight: {path: ["alternativeDescription"]},
                    "scoreDetails": true
                },
              },)
            }
      
            const currentYear = new Date().getFullYear()
            if (!!yearStartStr) {
              const yearStart = Number(yearStartStr)
              if (isNaN(+yearStart) || yearStart < 0) {
                res.status(400).json({ message: 'year start must be a positive number'})
                return
              }
              if (yearStart > currentYear) {
                res.status(400).json({ message: 'cannot specify year in the future'})
                return
              }
              pipeline.push({
                  $match: { 
                    year: { $gte: yearStart } 
                  }
              },)
            }
      
            if (!!yearEndStr) {
              const yearEnd = Number(yearEndStr)
              if (isNaN(+yearEnd) || yearEnd < 0) {
                res.status(400).json({ message: 'year end must be a positive number'})
                return
              }
              if (yearEnd > currentYear) {
                res.status(400).json({ message: 'cannot specify year in the future'})
                return
              }
              pipeline.push({
                $match: { 
                  year: { $lte: yearEnd } 
                }
            },)
            }
      
            // final of pipeline
            pipeline.push(
            {
              $project: {
                "name": 1,
                "year": 1,
                "description": 1,
                "alternativeDescription": 1,
                "authors": 1,
                "score": { "$meta": "searchScore" },
                "scoreDetails": {"$meta": "searchScoreDetails"},
                "highlights": { "$meta": "searchHighlights" },
              }
            },)
            pipeline.push(
              {
              $limit: 5
            })
            console.log(pipeline)
            // const books = await Book.find({})
            const books = await Book.aggregate(pipeline)
              // .populate('authors') // Populates the authors field with details
              .exec();
      
            await Author.populate(books, {path: "authors"});
            res.status(200).json(books);
          } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error bookService', error });
          }
    }

    public async findAllVector(req: Request, res: Response): Promise<any> {
      console.log('this is vector find')
        try {
            const pipeline = [];
            let searchText = req.query.search;
            let yearStartStr = req.query.yearStart;
            let yearEndStr = req.query.yearEnd;
            
            if (!!searchText) {
            const embedding = await this.tokenizerService.getEmbedding(searchText.toString())
            console.log('embedding', embedding);
              pipeline.push({
                "$vectorSearch": {
                  "exact": false,
                  // "filter": {<filter-specification>},
                  "index": "vector_thai",
                  "limit": 10,
                  "numCandidates": 10,
                  "path": "embeddings",
                  "queryVector": embedding
                }
              },)
            }
      
            const currentYear = new Date().getFullYear()
            if (!!yearStartStr) {
              const yearStart = Number(yearStartStr)
              if (isNaN(+yearStart) || yearStart < 0) {
                res.status(400).json({ message: 'year start must be a positive number'})
                return
              }
              if (yearStart > currentYear) {
                res.status(400).json({ message: 'cannot specify year in the future'})
                return
              }
              pipeline.push({
                  $match: { 
                    year: { $gte: yearStart } 
                  }
              },)
            }
      
            if (!!yearEndStr) {
              const yearEnd = Number(yearEndStr)
              if (isNaN(+yearEnd) || yearEnd < 0) {
                res.status(400).json({ message: 'year end must be a positive number'})
                return
              }
              if (yearEnd > currentYear) {
                res.status(400).json({ message: 'cannot specify year in the future'})
                return
              }
              pipeline.push({
                $match: { 
                  year: { $lte: yearEnd } 
                }
            },)
            }
      
            // final of pipeline
            pipeline.push(
            {
              $project: {
                "name": 1,
                "year": 1,
                "description": 1,
                "alternativeDescription": 1,
                "authors": 1,
                "score": { $meta: "vectorSearchScore" }
              }
            },)
            // pipeline.push(
            //   {
            //   $limit: 5
            // })
            console.log(pipeline)
            // const books = await Book.find({})
            const books = await Book.aggregate(pipeline)
              // .populate('authors') // Populates the authors field with details
              .exec();
      
            await Author.populate(books, {path: "authors"});
            res.status(200).json(books);
          } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error bookService', error });
          }
    }

    public async create(req: Request, res: Response): Promise<any> {
        try {
            const { name, year, authorName, description, alternative_description } = req.body;
            const existingBook = await Book.findOne({ name: name })
            const existingAuthor = await Author.findOne({ name: authorName })
            let authorId = existingAuthor?.id
            
            // check if name exists
            if (!!existingBook) {
                res.status(400).json({ message: 'name already exists'});
                return
            }
            if (isNaN(+year) || year < 0) {
                res.status(400).json({ message: 'year end must be a positive number'})
                return
            }

            if (!existingAuthor) {
                const newauthor: IAuthor = new Author({ name: authorName });
                await newauthor.save();
                authorId = newauthor.id
            }

            let tokenizedDescription: string | null = null
            if (!!alternative_description) {
                tokenizedDescription = (await this.tokenizerService.getTokenized(alternative_description)).join(' ')
            }

            const newbook: IBook = new Book({ 
                name, 
                year, 
                authors: [authorId], 
                description: description, 
                alternativeDescription: !!tokenizedDescription ? tokenizedDescription: '' 
            });
            await newbook.save();
            await Author.populate(newbook, {path: "authors"});
            res.status(201).json(newbook);
        } catch (error) {
            console.log('error', error);
            res.status(400).json({ message: 'Error creating book', error });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            const { name, year, authors } = req.body;
        
            
            const book = await Book.findByIdAndUpdate(
              req.params.id,
              {
                $set: { ...(name && { name }), ...(year && { year }), ...(authors && { authors }) }, // Only update provided fields
              },
              { new: true, runValidators: true }
            );
            if (!book) return res.status(404).json({ message: 'book not found' });
            res.status(200).json(book);
        } catch (error) {
            res.status(400).json({ message: 'Error updating book', error });
        }
    }

    public async deleteById(req: Request, res: Response): Promise<any> {
        try {
            const book = await Book.findByIdAndDelete(req.params.id);
            if (!book) return res.status(404).json({ message: 'book not found' });
            res.status(200).json({ message: 'book deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting book', error });
        }
    }

    public async clearAll(req: Request, res: Response): Promise<any> {
        try {
        await Book.deleteMany()
        res.status(200).json({ message: 'book deleted successfully' });
        } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
        }
    }
}



const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
};


import { exec } from 'child_process';
import { TokenizerResponseData } from "../models/tokenizerRequestModel";
import TokenizerService from "./tokenizerService";

// function callPythonFunction(x: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const input = JSON.stringify({ textinp: x }).replace(/"/g, '\\\"');
//         console.log(input)
//         const cmd = `python ./src/tokenizer.py '${input}'`
//         exec(cmd, (error, stdout, stderr) => {
//             console.log("cmd stdout", cmd, stdout)
//             if (error) {
//                 console.error('Error executing Python script:', stderr);
//                 reject(error);
//             } else {
//                 // const result = JSON.parse(stdout);
//                 console.log('Result from Python:', error, stdout, stderr);
//                 resolve('asd');
//             }
//         });
//     });
// }

// callPythonFunction("บ้านใหญ่").then((result) => {
//     console.log('Received result:', result);
// });
