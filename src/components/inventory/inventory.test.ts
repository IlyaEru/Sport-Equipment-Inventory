import mongoose from 'mongoose';
import db from '../../config/test-db';
import Category from '../category/category.model';
import Equipment from '../equipment/equipment.model';
import Inventory from './inventory.model';
import Location from '../location/location.model';

const equipmentData = {
  name: 'Test Equipment',
  description: 'Test Description',
  category: '63cd2dd05457331d80ce63f8',
  price: 100,
};

const locationData = {
  name: 'Test Location',
  address: 'Test Address',
};

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

/**
 * Inventory model
 *  */

describe('Inventory model', () => {
  test('create & save inventory successfully', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const validInventory = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: 10,
    });
    const savedInventory = await validInventory.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedInventory._id).toBeDefined();
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  test('insert inventory successfully, but the field not defined in schema should be undefined', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const inventoryWithInvalidField = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: 10,
      notDefinedInSchema: 'notDefinedInSchema',
    });
    const savedInventoryWithInvalidField =
      await inventoryWithInvalidField.save();
    expect(savedInventoryWithInvalidField._id).toBeDefined();
    // @ts-ignore
    expect(savedInventoryWithInvalidField.notDefinedInSchema).toBeUndefined();
  });

  test('create inventory without required field should failed', async () => {
    const inventoryWithoutRequiredField = new Inventory({
      quantity: 10,
    });
    let err;
    try {
      const savedInventoryWithoutRequiredField =
        await inventoryWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  test('create inventory with invalid objectId should failed', async () => {
    const inventoryWithInvalidObjectId = new Inventory({
      equipment: 'invalidObjectId',
      location: 'invalidObjectId',
      quantity: 10,
    });
    let err;
    try {
      const savedInventoryWithInvalidObjectId =
        await inventoryWithInvalidObjectId.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  test('create inventory with invalid min quantity should failed', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const inventoryWithInvalidQuantity = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: -1,
    });

    try {
      const savedInventoryWithInvalidQuantity =
        await inventoryWithInvalidQuantity.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  test('create inventory with invalid max quantity should failed', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const inventoryWithInvalidQuantity = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: 99999999,
    });
    try {
      const savedInventoryWithInvalidQuantity =
        await inventoryWithInvalidQuantity.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  test('create inventory with invalid quantity type should failed', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const inventoryWithInvalidQuantityType = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: 'invalidQuantityType',
    });

    try {
      const savedInventoryWithInvalidQuantityType =
        await inventoryWithInvalidQuantityType.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  test('Adding new inventory should add the inventory reference to the location', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const inventory = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: 10,
    });
    const savedInventory = await inventory.save();
    const foundLocation = await Location.findById(location.id);
    expect(
      foundLocation?.inventory.find((i) => i.equals(savedInventory.id)),
    ).toBeDefined();
  });

  test('Removing inventory should also remove the inventory reference from the location ', async () => {
    const [equipment, location] = await Promise.all([
      new Equipment(equipmentData).save(),
      new Location(locationData).save(),
    ]);

    const inventory = new Inventory({
      equipment: equipment.id,
      location: location.id,
      quantity: 10,
    });
    const savedInventory = await inventory.save();

    const deleteResp = await Inventory.deleteOne({ _id: savedInventory.id });

    const foundLocation = await Location.findById(location.id);

    expect(
      foundLocation?.inventory.find((i) => i.equals(savedInventory.id)),
    ).toBeUndefined();
  });
});
