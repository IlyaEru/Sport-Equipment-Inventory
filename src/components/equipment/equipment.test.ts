import mongoose from 'mongoose';
import db from '../../config/test-db';
import Equipment from './equipment.model';
import Category from '../category/category.model';
import Inventory from '../inventory/inventory.model';
import { EquipmentType } from './equipment.type';

const EquipmentData = {} as EquipmentType;

beforeAll(async () => {
  await db.setUp();
  const category = new Category({
    name: 'Test Category',
  });
  await category.save();

  EquipmentData.name = 'Test Equipment';
  EquipmentData.description = 'Test Description';
  EquipmentData.category = category.id;
  EquipmentData.price = 100;
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

/**
 * Equipment model
 */
describe('Equipment model', () => {
  test('create & save equipment successfully', async () => {
    const validEquipment = new Equipment(EquipmentData);
    const savedEquipment = await validEquipment.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedEquipment._id).toBeDefined();

    expect(savedEquipment.name).toBe(EquipmentData.name);
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert equipment successfully, but the field not defined in schema should be undefined', async () => {
    const equipmentWithInvalidField = new Equipment({
      ...EquipmentData,
      notDefinedInSchema: 'notDefinedInSchema',
    });
    const savedEquipmentWithInvalidField =
      await equipmentWithInvalidField.save();
    expect(savedEquipmentWithInvalidField._id).toBeDefined();
    // @ts-ignore
    expect(savedEquipmentWithInvalidField.notDefinedInSchema).toBeUndefined();
  });

  // It should us tell us the errors in on name field.
  it('create equipment without required field should failed', async () => {
    const equipmentWithoutRequiredField = new Equipment({
      ...EquipmentData,
      name: undefined,
    });
    let err;
    try {
      const savedEquipmentWithoutRequiredField =
        await equipmentWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore

    expect(err.errors.name).toBeDefined();
    // @ts-ignore
  });

  it('create equipment with invalid category should failed', async () => {
    const equipmentWithInvalidCategory = new Equipment({
      ...EquipmentData,
      category: 'invalid category',
    });
    let err;
    try {
      const savedEquipmentWithInvalidCategory =
        await equipmentWithInvalidCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.category).toBeDefined();
    // @ts-ignore
  });

  it('create equipment with invalid price should failed', async () => {
    const equipmentWithInvalidPrice = new Equipment({
      ...EquipmentData,
      price: -1,
    });
    let err;
    try {
      const savedEquipmentWithInvalidPrice =
        await equipmentWithInvalidPrice.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.price).toBeDefined();
    // @ts-ignore
  });

  it('create equipment with invalid description should failed', async () => {
    const equipmentWithInvalidDescription = new Equipment({
      ...EquipmentData,
      description: 'a'.repeat(501),
    });
    let err;
    try {
      const savedEquipmentWithInvalidDescription =
        await equipmentWithInvalidDescription.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.description).toBeDefined();
  });

  it('create equipment with invalid name should failed', async () => {
    const equipmentWithInvalidName = new Equipment({
      ...EquipmentData,
      name: 'a'.repeat(51),
    });
    let err;
    try {
      const savedEquipmentWithInvalidName =
        await equipmentWithInvalidName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.name).toBeDefined();
  });

  it('create equipment with invalid name type failed', async () => {
    const equipmentWithInvalidName = new Equipment({
      ...EquipmentData,
      name: 123,
    });
    let err;
    try {
      const savedEquipmentWithInvalidName =
        await equipmentWithInvalidName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.name).toBeDefined();
  });

  it('create equipment with invalid price type failed', async () => {
    const equipmentWithInvalidPrice = new Equipment({
      ...EquipmentData,
      price: '12a',
    });
    let err;
    try {
      const savedEquipmentWithInvalidPrice =
        await equipmentWithInvalidPrice.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.price).toBeDefined();
  });

  it('create equipment with invalid description type failed', async () => {
    const equipmentWithInvalidDescription = new Equipment({
      ...EquipmentData,
      description: 123,
    });
    let err;
    try {
      const savedEquipmentWithInvalidDescription =
        await equipmentWithInvalidDescription.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    // @ts-ignore
    expect(err.errors.description).toBeDefined();
  });

  it('unique constraint on the name field is working correctly', async () => {
    const equipment = new Equipment(EquipmentData);
    await equipment.save();
    const equipment2 = new Equipment(EquipmentData);
    let err;
    try {
      await equipment2.save();
    } catch (error: any) {
      err = error;
    }
    expect(err.code).toBe(11000);
  });

  it('whitespace trimming is working correctly', async () => {
    const equipment = new Equipment({
      ...EquipmentData,
      name: '   equipment name   ',
    });
    const savedEquipment = await equipment.save();
    expect(savedEquipment.name).toBe('equipment name');
  });

  // testing deleteOne middleware

  it('deleteOne middleware is working correctly', async () => {
    const equipment = new Equipment(EquipmentData);
    const savedEquipment = await equipment.save();

    const inventoryWithEquipment = new Inventory({
      equipment: savedEquipment._id,
      quantity: 1,
      location: '63cd06b8b10286dc4510e691',
    });
    const savedInventoryWithEquipment = await inventoryWithEquipment.save();

    await Equipment.deleteOne({ _id: savedEquipment._id });
    const inventory = await Inventory.findById(savedInventoryWithEquipment._id);
    expect(inventory).toBeNull();
  });

  // testing deleteMany middleware

  it('deleteMany middleware is working correctly', async () => {
    const equipment = new Equipment({
      name: 'equipment1',
      price: 1,
      category: EquipmentData.category,
      description: 'description1',
    });
    const savedEquipment = await equipment.save();

    const equipment2 = new Equipment({
      name: 'equipment2',
      price: 1,
      category: EquipmentData.category,
      description: 'description2',
    });
    const savedEquipment2 = await equipment2.save();

    const inventoryWithEquipment = new Inventory({
      equipment: savedEquipment._id,
      quantity: 1,
      location: '63cd06b8b10286dc4510e691',
    });
    const savedInventoryWithEquipment = await inventoryWithEquipment.save();

    const inventoryWithEquipment2 = new Inventory({
      equipment: savedEquipment2._id,
      quantity: 1,
      location: '63cd06b8b10286dc4510e691',
    });
    const savedInventoryWithEquipment2 = await inventoryWithEquipment2.save();

    await Equipment.deleteMany({ category: EquipmentData.category });
    const inventory = await Inventory.findById(savedInventoryWithEquipment._id);
    const inventory2 = await Inventory.findById(
      savedInventoryWithEquipment2._id,
    );
    expect(inventory).toBeNull();
    expect(inventory2).toBeNull();
  });

  // test for equipment update, and search by name

  it('update equipment', async () => {
    const equipment = new Equipment(EquipmentData);
    const savedEquipment = await equipment.save();
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      savedEquipment._id,
      { name: 'updated name' },
      { new: true },
    );
    expect(updatedEquipment?.name).toBe('updated name');
  });

  it('search equipment by name', async () => {
    const equipment = new Equipment(EquipmentData);
    const savedEquipment = await equipment.save();
    const foundEquipment = await Equipment.findOne({
      name: EquipmentData.name,
    });
    expect(foundEquipment?.name).toBe(EquipmentData.name);
  });
});
