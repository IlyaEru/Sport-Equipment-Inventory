import express from 'express';

import {
  getEquipments,
  getEquipment,
  getCreateEquipment,
  postCreateEquipment,
  getUpdateEquipment,
  postUpdateEquipment,
  getDeleteEquipment,
  postDeleteEquipment,
} from './equipment.controller';

const router = express.Router();

router.get('/', getEquipments);

router.get('/create', getCreateEquipment);

router.post('/create', postCreateEquipment);

router.get('/:id', getEquipment);

router.get('/:id/update', getUpdateEquipment);

router.post('/:id/update', postUpdateEquipment);

router.get('/:id/delete', getDeleteEquipment);

router.post('/:id/delete', postDeleteEquipment);

export default router;
