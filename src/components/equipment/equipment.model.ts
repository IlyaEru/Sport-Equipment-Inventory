import mongoose from 'mongoose';
import Inventory from '../inventory/inventory.model';
import Category from '../category/category.model';
import Equipment from './equipment.model';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
  },
  {
    versionKey: false,
  },
);

equipmentSchema.pre('deleteOne', async function (next) {
  // Get the id of the equipment being deleted
  const equipmentId = this.getQuery()._id;

  // Delete all inventory documents that have a reference to this equipment
  await Inventory.deleteMany({ equipment: equipmentId });

  // Continue with the delete operation
  next();
});

equipmentSchema.pre('deleteMany', async function (next) {
  try {
    const deletedEquipment = await Equipment.find(this.getQuery()).lean();

    const equipmentIds = deletedEquipment.map((equipment) => equipment._id);

    const resp = await Inventory.deleteMany({
      equipment: { $in: equipmentIds },
    });
  } catch (error: any) {
    return next(error);
  }
});

export default mongoose.model('Equipment', equipmentSchema);
