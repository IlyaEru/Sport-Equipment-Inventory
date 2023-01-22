import mongoose from 'mongoose';

export interface LocationType {
  name: string;
  address: string;
  inventory: mongoose.Schema.Types.ObjectId;
  _id: mongoose.Schema.Types.ObjectId;
}
