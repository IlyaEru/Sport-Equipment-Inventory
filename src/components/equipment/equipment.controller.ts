import Equipment from './equipment.model';
import Category from '../category/category.model';
import Inventory from '../inventory/inventory.model';

import express from 'express';

import { body, validationResult } from 'express-validator';

const getEquipments = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const equipments = await Equipment.find().sort('name').populate('category');
    res.render('equipment/equipment_list', {
      equipmentList: equipments,
      title: 'Equipment List',
    });
  } catch (err) {
    next(err);
  }
};

const getEquipment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      'category',
    );
    if (!equipment) {
      const err: any = new Error('Equipment not found');
      err.status = 404;
      return next(err);
    }
    res.render('equipment/equipment_detail', {
      equipment,
      title: equipment.name,
    });
  } catch (err) {
    next(err);
  }
};

const getCreateEquipment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const categoryList = await Category.find().sort('name');
    res.render('equipment/equipment_form', {
      categoryList,
      title: 'Create Equipment',
    });
  } catch (error) {
    next(error);
  }
};

const postCreateEquipment = [
  body('name', 'Equipment name required').trim().isLength({ min: 1 }).escape(),
  body('category', 'Category required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('price', 'Price required').trim().isLength({ min: 1 }).escape(),

  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    const existingEquipment = await Equipment.findOne({
      name: req.body.name,
    });
    const categoryList = await Category.find().sort('name');
    if (existingEquipment) {
      return res.render('equipment/equipment_form', {
        title: 'Create Equipment',
        categoryList,
        errors: [{ msg: 'Equipment already exists' }],
      });
    }
    const equipment = new Equipment({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
    });
    if (!errors.isEmpty()) {
      try {
        res.render('equipment/equipment_form', {
          categoryList,
          title: 'Create Equipment',
          equipment,
          errors: errors.array(),
        });
      } catch (error) {
        next(error);
      }
    } else {
      try {
        await equipment.save();
        res.redirect(`/equipment/${equipment.id}`);
      } catch (error) {
        next(error);
      }
    }
  },
];

const getUpdateEquipment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const equipment = await Equipment.findById(req.params.id).populate(
    'category',
  );
  if (!equipment) {
    const err: any = new Error('Equipment not found');
    err.status = 404;
    return next(err);
  }
  const name = equipment.name;
  const selectedCategoryId = equipment.category.id;
  const description = equipment.description;
  const price = equipment.price;

  const categoryList = await Category.find().sort('name');
  res.render('equipment/equipment_form', {
    categoryList,
    title: 'Update Equipment',
    equipment,
    name,
    selectedCategoryId,
    description,
    price,
    update: true,
  });
};

const postUpdateEquipment = [
  body('name', 'Equipment name required').trim().isLength({ min: 1 }).escape(),
  body('category', 'Category required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('price', 'Price required').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must be a number').isNumeric(),
  body('price', 'Price must be greater than 0').isFloat({ gt: 0 }),
  body('name').custom(async (value) => {
    const existingEquipment = await Equipment.findOne({
      name: value,
    });
    if (existingEquipment) {
      throw new Error('Equipment already exists');
    }
    return true;
  }),

  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    const equipment = new Equipment({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      try {
        const name = equipment.name;
        const selectedCategoryId = equipment.category.toString();
        const description = equipment.description;
        const price = equipment.price;

        const categoryList = await Category.find().sort('name');
        res.render('equipment/equipment_form', {
          categoryList,
          title: 'Update Equipment',
          equipment,
          name,
          selectedCategoryId,
          description,
          price,
          update: true,
          errors: errors.array(),
        });
      } catch (error) {
        next(error);
      }
    } else {
      try {
        const existingEquipment = await Equipment.findOneAndUpdate(
          { _id: req.params.id },
          equipment,
        );
        res.redirect(`/equipment/${existingEquipment?.id}`);
      } catch (error) {
        next(error);
      }
    }
  },
];

const getDeleteEquipment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const [equipment, equipmentInventory] = await Promise.all([
    Equipment.findById(req.params.id).populate('category'),
    Inventory.find({ equipment: req.params.id }).populate('location'),
  ]);
  if (!equipment) {
    const err: any = new Error('Equipment not found');
    err.status = 404;
    return next(err);
  }
  res.render('equipment/equipment_delete', {
    equipment,
    title: `Delete Equipment: ${equipment.name}`,
    equipmentInventory,
  });
};

const postDeleteEquipment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    await Equipment.deleteOne({ _id: req.params.id });
    res.redirect('/equipment');
  } catch (error) {
    next(error);
  }
};

export {
  getEquipments,
  getEquipment,
  getCreateEquipment,
  postCreateEquipment,
  getUpdateEquipment,
  postUpdateEquipment,
  getDeleteEquipment,
  postDeleteEquipment,
};
