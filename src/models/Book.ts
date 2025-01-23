import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface
export interface IBook extends Document {
  name: string;
  year: number
  description: string;
  alternativeDescription: string;
  embeddings: number[];
  authors: mongoose.Types.ObjectId[]; // Array of author ObjectIds
}

// Define the schema
const BookSchema: Schema = new Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  description: { type: String, required: false },
  alternativeDescription: { type: String, required: false },
  embeddings: { type: [Number], required: false },
  authors: [{
    type: Schema.Types.ObjectId,
    ref: "Authors"
  }]
});

// Export the model
export const Book = mongoose.model<IBook>('Books', BookSchema);
