import mongoose from 'mongoose';
import db from '../../config/test-db';
import Category from './category.model';
import Equipment from '../equipment/equipment.model';
import Inventory from '../inventory/inventory.model';

const CategoryData = {
  name: 'Test Category',
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
 * Category model
 */
describe('Category model', () => {
  test('create & save category successfully', async () => {
    const validCategory = new Category(CategoryData);
    const savedCategory = await validCategory.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedCategory._id).toBeDefined();

    expect(savedCategory.name).toBe(CategoryData.name);
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert category successfully, but the field not defined in schema should be undefined', async () => {
    const categoryWithInvalidField = new Category({
      name: 'Test Category',

      notDefinedInSchema: 'notDefinedInSchema',
    });
    const savedCategoryWithInvalidField = await categoryWithInvalidField.save();
    expect(savedCategoryWithInvalidField._id).toBeDefined();
    // @ts-ignore
    expect(savedCategoryWithInvalidField.notDefinedInSchema).toBeUndefined();
  });
});

// It should us tell us the errors in on name field.
it('create category without required field should failed', async () => {
  const categoryWithoutRequiredField = new Category({});
  let err;
  try {
    const savedCategoryWithoutRequiredField =
      await categoryWithoutRequiredField.save();
  } catch (error) {
    err = error;
  }
  expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  // @ts-ignore
  expect(err.errors.name).toBeDefined();
});

test(' unique constraint on the name field is working correctly', async () => {
  const category = new Category(CategoryData);
  await category.save();
  const duplicateCategory = new Category(CategoryData);
  let err;
  try {
    const savedDuplicateCategory = await duplicateCategory.save();
  } catch (error: any) {
    err = error;
  }

  expect(err.code).toBe(11000);
  // @ts-ignore
});

test('minimum length of name is working correctly', async () => {
  const category = new Category({
    name: 'Te',
  });
  let err;
  try {
    const savedCategory = await category.save();
  } catch (error) {
    err = error;
  }
  expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  // @ts-ignore
  expect(err.errors.name).toBeDefined();
});

test('maximum length of name is working correctly', async () => {
  const category = new Category({
    name: 'Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category Test Category',
  });
  let err;
  try {
    const savedCategory = await category.save();
  } catch (error) {
    err = error;
  }
  expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  // @ts-ignore
  expect(err.errors.name).toBeDefined();
});

test('invalid name type is working correctly', async () => {
  const category = new Category({
    name: 1234,
  });
  let err;
  try {
    const savedCategory = await category.save();
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
  const category = new Category({
    name: ' Test Category ',
  });
  const savedCategory = await category.save();
  expect(savedCategory.name).toBe('Test Category');
});

// testing deleteOne middleware
test('deleteOne middleware is working correctly', async () => {
  const category = new Category(CategoryData);
  const savedCategory = await category.save();

  const equipment = new Equipment({
    name: 'Test Equipment',
    category: savedCategory._id,
    description: 'Test Equipment Description',
    price: 100,
  });
  const savedEquipment = await equipment.save();

  await Category.deleteOne({ _id: savedCategory._id });

  const deletedEquipment = await Equipment.findById(savedEquipment._id);
  expect(deletedEquipment).toBeNull();
});

// test for category update, and search by name

test('update is working correctly', async () => {
  const category = new Category(CategoryData);
  try {
    const savedCategory = await category.save();
    const updatedCategory = await Category.updateOne(
      { _id: savedCategory._id },
      { name: 'Test Category Updated' },
    );
    const foundCategory = await Category.findById(savedCategory._id);
    expect(foundCategory?.name).toBe('Test Category Updated');
  } catch (error) {
    console.log(error);
  }
});

test('search by name is working correctly', async () => {
  const category = new Category(CategoryData);
  try {
    const savedCategory = await category.save();
    const foundCategory = await Category.findOne({ name: 'Test Category' });
    expect(foundCategory?.name).toBe('Test Category');
  } catch (error) {
    console.log(error);
  }
});
