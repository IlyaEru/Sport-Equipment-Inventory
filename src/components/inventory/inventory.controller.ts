import Inventory from './inventory.model';
import Equipment from '../equipment/equipment.model';
import Location from '../location/location.model';
import express from 'express';

import { body, validationResult } from 'express-validator';

const getInventories = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const inventories = await Inventory.find()
      .populate('equipment')
      .populate('location');

    res.render('inventory/inventory_list', {
      inventoryList: inventories,
      title: 'Inventory List',
    });
  } catch (err) {
    next(err);
  }
};

const getInventory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      const err: any = new Error('Inventory not found');
      err.status = 404;
      return next(err);
    }
    const [inventoryEquipment, inventoryLocation] = await Promise.all([
      Equipment.findById(inventory.equipment).populate('category'),
      Location.findById(inventory.location),
    ]);
    res.render('inventory/inventory_detail', {
      inventory,
      inventoryEquipment,
      inventoryLocation,
      title: `${inventoryEquipment?.name} at ${inventoryLocation?.name}`,
    });
  } catch (err) {
    next(err);
  }
};

const getCreateInventory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const [equipmentList, locationList] = await Promise.all([
      Equipment.find().sort('name'),
      Location.find().sort('name'),
    ]);
    res.render('inventory/inventory_form', {
      title: 'Create Inventory',
      equipmentList,
      locationList,
    });
  } catch (error) {
    next(error);
  }
};

const postCreateInventory = [
  body('equipment', 'Equipment must be specified').trim().isLength({ min: 1 }),
  body('location', 'Location must be specified').trim().isLength({ min: 1 }),
  body('quantity', 'Quantity must be specified').trim().isLength({ min: 1 }),
  body('quantity', 'Quantity must be a number').isNumeric(),
  body('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
  body('quantity', 'Quantity must be a whole number').isInt({ max: 1000 }),

  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [equipmentList, locationList] = await Promise.all([
        Equipment.find().sort('name'),
        Location.find().sort('name'),
      ]);
      res.render('inventory/inventory_form', {
        title: 'Create Inventory',
        equipmentList,
        locationList,
        errors: errors.array(),
      });
    } else {
      const inventory = new Inventory({
        equipment: req.body.equipment,
        location: req.body.location,
        quantity: req.body.quantity,
      });
      try {
        await inventory.save();
        res.redirect(`/inventory/${inventory.id}`);
      } catch (err) {
        next(err);
      }
    }
  },
];

const getUpdateInventory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      const err: any = new Error('Inventory not found');
      err.status = 404;
      return next(err);
    }
    const [equipmentList, locationList] = await Promise.all([
      Equipment.find().sort('name'),
      Location.find().sort('name'),
    ]);
    res.render('inventory/inventory_form', {
      title: 'Update Inventory',
      equipmentList,
      locationList,
      inventory,
      quantity: inventory.quantity,
      location_id: inventory.location,
      equipment_id: inventory.equipment,
      update: true,
    });
  } catch (error) {
    next(error);
  }
};

const postUpdateInventory = [
  body('equipment', 'Equipment must be specified').trim().isLength({ min: 1 }),
  body('location', 'Location must be specified').trim().isLength({ min: 1 }),
  body('quantity', 'Quantity must be specified').trim().isLength({ min: 1 }),
  body('quantity', 'Quantity must be a number').isNumeric(),
  body('quantity', 'Quantity must be a positive whole number').isInt({
    min: 1,
  }),

  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [equipmentList, locationList] = await Promise.all([
        Equipment.find().sort('name'),
        Location.find().sort('name'),
      ]);
      res.render('inventory/inventory_form', {
        title: 'Update Inventory',
        equipmentList,
        locationList,
        errors: errors.array(),
        quantity: req.body.quantity,
        location_id: req.body.location,
        equipment_id: req.body.equipment,
        update: true,
      });
    } else {
      const inventory = await Inventory.findById(req.params.id);
      if (!inventory) {
        const err: any = new Error('Inventory not found');
        err.status = 404;
        return next(err);
      }
      inventory.equipment = req.body.equipment;
      inventory.location = req.body.location;
      inventory.quantity = req.body.quantity;
      try {
        await inventory.save();
        res.redirect(`/inventory/${inventory.id}`);
      } catch (err) {
        next(err);
      }
    }
  },
];

const getDeleteInventory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate('equipment')
    .populate('location');
  const [inventoryEquipment, inventoryLocation] = await Promise.all([
    Equipment.findById(inventory?.equipment),
    Location.findById(inventory?.location),
  ]);
  res.render('inventory/inventory_delete', {
    inventory,

    title: `Delete Inventory Record ${inventoryEquipment?.name} at ${inventoryLocation?.name}`,
  });
};

const postDeleteInventory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    await Inventory.deleteOne({ _id: req.params.id });
    res.redirect('/inventory');
  } catch (err) {
    next(err);
  }
};

export {
  getInventories,
  getInventory,
  getCreateInventory,
  postCreateInventory,
  getUpdateInventory,
  postUpdateInventory,
  getDeleteInventory,
  postDeleteInventory,
};
