import mongoose from 'mongoose';
import db from '../../config/test-db';
import Location from './location.model';
import Equipment from '../equipment/equipment.model';
import Inventory from '../inventory/inventory.model';

const LocationData = {
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
 * Location model
 */
describe('Location model', () => {
  test('create & save location successfully', async () => {
    const validLocation = new Location(LocationData);
    const savedLocation = await validLocation.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedLocation._id).toBeDefined();

    expect(savedLocation.name).toBe(LocationData.name);
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert location successfully, but the field not defined in schema should be undefined', async () => {
    const locationWithInvalidField = new Location({
      ...LocationData,
      notDefinedInSchema: 'notDefinedInSchema',
    });
    const savedLocationWithInvalidField = await locationWithInvalidField.save();
    expect(savedLocationWithInvalidField._id).toBeDefined();
    // @ts-ignore
    expect(savedLocationWithInvalidField.notDefinedInSchema).toBeUndefined();
  });

  // It should us tell us the errors in on name field.
  it('create location without required field should failed', async () => {
    const locationWithoutRequiredField = new Location({});
    let err;
    try {
      const savedLocationWithoutRequiredField =
        await locationWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.name).toBeDefined();
  });

  test(' unique constraint on the name field is working correctly', async () => {
    const location = new Location(LocationData);
    await location.save();
    const duplicateLocation = new Location(LocationData);
    let err;
    try {
      const savedDuplicateLocation = await duplicateLocation.save();
    } catch (error: any) {
      err = error;
    }

    expect(err.code).toBe(11000);
    // @ts-ignore
  });

  test('minimum length of name is working correctly', async () => {
    const location = new Location({
      name: 'Te',
    });
    let err;
    try {
      const savedLocation = await location.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.name).toBeDefined();
  });

  test('maximum length of name is working correctly', async () => {
    const location = new Location({
      name: 'Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location Test Location',
    });
    let err;
    try {
      const savedLocation = await location.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.name).toBeDefined();
  });

  test('invalid name type is working correctly', async () => {
    const location = new Location({
      name: 1234,
    });
    let err;
    try {
      const savedLocation = await location.save();
    } catch (error) {
      console.log({ error });

      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    console.log({ err });

    // @ts-ignore
    expect(err.errors.name).toBeDefined();
  });

  test('whitespace trimming is working correctly', async () => {
    const location = new Location({ ...LocationData, name: ' Test Location ' });
    const savedLocation = await location.save();
    expect(savedLocation.name).toBe('Test Location');
  });

  // testing deleteOne middleware
  test('deleteOne middleware is working correctly', async () => {
    const location = new Location(LocationData);
    const savedLocation = await location.save();

    const inventoryInLocation = new Inventory({
      quantity: 10,
      location: savedLocation._id,
      equipment: '63cd2dd05457331d80ce63f8',
    });
    const savedInventoryInLocation = await inventoryInLocation.save();

    await Location.deleteOne({ _id: savedLocation._id });
    const foundInventory = await Inventory.findById(
      savedInventoryInLocation._id,
    );
    expect(foundInventory).toBeNull();
  });

  // test for location update, and search by name

  test('update is working correctly', async () => {
    const location = new Location(LocationData);
    try {
      const savedLocation = await location.save();
      const updatedLocation = await Location.updateOne(
        { _id: savedLocation._id },
        { name: 'Test Location Updated' },
      );
      const foundLocation = await Location.findById(savedLocation._id);
      expect(foundLocation?.name).toBe('Test Location Updated');
    } catch (error) {
      console.log(error);
    }
  });

  test('search by name is working correctly', async () => {
    const location = new Location(LocationData);
    try {
      const savedLocation = await location.save();
      const foundLocation = await Location.findOne({ name: 'Test Location' });
      expect(foundLocation?.name).toBe('Test Location');
    } catch (error) {
      console.log(error);
    }
  });
});
