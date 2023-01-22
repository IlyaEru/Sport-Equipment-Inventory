import express from 'express';

import {
  getCategories,
  getCategory,
  getCreateCategory,
  postCreateCategory,
  getUpdateCategory,
  postUpdateCategory,
  getDeleteCategory,
  postDeleteCategory,
} from './category.controller';

const router = express.Router();

router.get('/', getCategories);

router.get('/create', getCreateCategory);

router.post('/create', postCreateCategory);

router.get('/:id', getCategory);

router.get('/:id/update', getUpdateCategory);

router.post('/:id/update', postUpdateCategory);

router.get('/:id/delete', getDeleteCategory);

router.post('/:id/delete', postDeleteCategory);

export default router;
