import Location from './location.model';
import Inventory from '../inventory/inventory.model';
import express from 'express';

import { body, validationResult } from 'express-validator';

const getLocations = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const locations = await Location.find().sort('name');
    res.render('location/location_list', {
      locationList: locations,
      title: 'Location List',
    });
  } catch (err) {
    next(err);
  }
};

const getLocation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const [location, locationInventory] = await Promise.all([
      Location.findById(req.params.id),
      Inventory.find({ location: req.params.id }).populate('equipment'),
    ]);
    if (!location) {
      const err: any = new Error('Location not found');
      err.status = 404;
      return next(err);
    }

    res.render('location/location_detail', {
      location,
      locationInventory,
      title: location.name,
    });
  } catch (err) {
    next(err);
  }
};

const getCreateLocation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.render('location/location_form', {
    title: 'Create Location',
  });
};

const postCreateLocation = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('address', 'Address must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    const existingLocation = await Location.findOne({
      name: req.body.name,
    });
    if (existingLocation) {
      return res.render('location/location_form', {
        title: 'Create Location',
        errors: [{ msg: 'Location already exists' }],
      });
    }
    const location = new Location({
      name: req.body.name,
      address: req.body.address,
    });
    if (!errors.isEmpty()) {
      const name = req.body.name;
      const address = req.body.address;
      res.render('location/location_form', {
        title: 'Create Location',
        location,
        name,
        address,
        errors: errors.array(),
      });
      return;
    }
    try {
      const newLocation = await location.save();
      res.redirect(`/location/${newLocation.id}`);
    } catch (err) {
      next(err);
    }
  },
];

const getUpdateLocation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      const err: any = new Error('Location not found');
      err.status = 404;
      return next(err);
    }
    res.render('location/location_form', {
      title: `Update Location: ${location.name}`,
      name: location.name,
      address: location.address,
      location,
      update: true,
    });
  } catch (err) {
    next(err);
  }
};

const postUpdateLocation = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('address', 'Address must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('name').custom(async (value) => {
    const existingLocation = await Location.findOne({ name: value });
    if (existingLocation) {
      throw new Error('Location already exists');
    }
  }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    const location = new Location({
      name: req.body.name,
      address: req.body.address,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const name = req.body.name;
      const address = req.body.address;
      res.render('location/location_form', {
        title: `Update Location: ${location.name}`,
        location,
        name,
        address,
        errors: errors.array(),
        update: true,
      });
      return;
    }
    try {
      const updatedLocation = await Location.findByIdAndUpdate(
        req.params.id,
        location,
        {},
      );
      res.redirect(`/location/${updatedLocation?.id}`);
    } catch (err) {
      next(err);
    }
  },
];

const getDeleteLocation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const [location, locationInventory] = await Promise.all([
    Location.findById(req.params.id),
    Inventory.find({ location: req.params.id }).populate('equipment'),
  ]);
  if (!location) {
    const err: any = new Error('Location not found');
    err.status = 404;
    return next(err);
  }

  res.render('location/location_delete', {
    location,
    locationInventory,
    title: `Delete Location: ${location.name}`,
  });
};

const postDeleteLocation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    await Location.deleteOne({ _id: req.params.id });
    res.redirect('/location');
  } catch (err) {
    next(err);
  }
};

export {
  getLocations,
  getLocation,
  getCreateLocation,
  postCreateLocation,
  getUpdateLocation,
  postUpdateLocation,
  getDeleteLocation,
  postDeleteLocation,
};
