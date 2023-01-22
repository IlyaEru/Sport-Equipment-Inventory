import mongoose from 'mongoose';

export interface EquipmentType {
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  price: number;
}
