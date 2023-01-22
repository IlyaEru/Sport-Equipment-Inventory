import mongoose from 'mongoose';
import Location from '../location/location.model';

const inventorySchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

inventorySchema.post('save', async function (inventory, next) {
  // Get the id of the inventory document that was just saved
  const inventoryId = inventory._id;

  // Get the id of the location that the inventory document was saved to
  const locationId = inventory.location;

  // Add the inventory document to the location's inventory array
  await mongoose.model('Location').updateOne(
    { _id: locationId },
    {
      $addToSet: {
        inventory: inventoryId,
      },
    },
  );

  // Continue with the save operation
  next();
});

inventorySchema.pre('deleteOne', async function (next) {
  // Get the id of the inventory being deleted
  const inventoryId = this.getQuery()._id;

  // Get the id of the location that the inventory is being deleted from
  const locationId = (await mongoose.model('Inventory').findById(inventoryId))
    .location;

  // Remove the inventory document from the location's inventory array
  await Location.updateOne(
    { _id: locationId },
    {
      $pull: {
        inventory: inventoryId,
      },
    },
  );

  // Continue with the delete operation

  next();
});

export default mongoose.model('Inventory', inventorySchema);
