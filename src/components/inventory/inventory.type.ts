import mongoose from 'mongoose';

export interface InventoryType {
  equipment: mongoose.Schema.Types.ObjectId;
  location: mongoose.Schema.Types.ObjectId;
  quantity: number;
  _id: mongoose.Schema.Types.ObjectId;
}
