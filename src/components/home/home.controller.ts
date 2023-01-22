import express from 'express';

import Category from '../category/category.model';
import Equipment from '../equipment/equipment.model';
import Inventory from '../inventory/inventory.model';
import Location from '../location/location.model';

export const getHome = async (req: express.Request, res: express.Response) => {
  // count documents in each collection
  const [categoriesAmount, equipmentsAmount, locationsAmount, inventoryAmount] =
    await Promise.all([
      Category.countDocuments(),
      Equipment.countDocuments(),
      Location.countDocuments(),
      Inventory.countDocuments(),
    ]);

  // render home view
  res.render('index', {
    title: 'Home',
    categoriesAmount,
    equipmentsAmount,
    locationsAmount,
    inventoryAmount,
  });
};
