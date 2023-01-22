import express from 'express';

import {
  getLocations,
  getLocation,
  getCreateLocation,
  postCreateLocation,
  getUpdateLocation,
  postUpdateLocation,
  getDeleteLocation,
  postDeleteLocation,
} from './location.controller';

const router = express.Router();

router.get('/', getLocations);

router.get('/create', getCreateLocation);

router.post('/create', postCreateLocation);

router.get('/:id', getLocation);

router.get('/:id/update', getUpdateLocation);

router.post('/:id/update', postUpdateLocation);

router.get('/:id/delete', getDeleteLocation);

router.post('/:id/delete', postDeleteLocation);

export default router;
