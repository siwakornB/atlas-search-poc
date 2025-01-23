import mongoose, { Schema, Document } from 'mongoose';

// Define the Author interface
export interface IAuthor extends Document {
  // _id: string;
  name: string;
  // email?: string;
  // age?: number;
}

// Define the schema
const AuthorSchema: Schema = new Schema({
  // _id: { type: String, required: false },
  name: { type: String, required: true },
  // email: { type: String, required: false, unique: false },
  // age: { type: Number, required: false },
}, { collection : 'authors', } );

// Export the model
export const Author = mongoose.model<IAuthor>('Authors', AuthorSchema);
