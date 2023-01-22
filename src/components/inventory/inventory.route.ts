import express from 'express';

import {
  getInventories,
  getInventory,
  getCreateInventory,
  postCreateInventory,
  getUpdateInventory,
  postUpdateInventory,
  getDeleteInventory,
  postDeleteInventory,
} from './inventory.controller';

const router = express.Router();

router.get('/', getInventories);

router.get('/create', getCreateInventory);

router.post('/create', postCreateInventory);

router.get('/:id', getInventory);

router.get('/:id/update', getUpdateInventory);

router.post('/:id/update', postUpdateInventory);

router.get('/:id/delete', getDeleteInventory);

router.post('/:id/delete', postDeleteInventory);

export default router;
