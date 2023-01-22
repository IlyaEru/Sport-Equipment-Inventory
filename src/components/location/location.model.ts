import mongoose from 'mongoose';
import { LocationType } from './location.type';
import Inventory from '../inventory/inventory.model';

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    inventory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
  },
  {
    versionKey: false,
  },
);

LocationSchema.pre('deleteOne', async function (next) {
  // Get the id of the location being deleted
  const locationId = this.getQuery()._id;

  // Delete all inventory documents that have a reference to this location
  await Inventory.deleteMany({ location: locationId });

  // Continue with the delete operation
  next();
});

export default mongoose.model('Location', LocationSchema);
