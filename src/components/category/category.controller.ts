import Category from './category.model';
import Equipment from '../equipment/equipment.model';
import express from 'express';

import { body, validationResult } from 'express-validator';

const getCategories = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const [categories, equipments] = await Promise.all([
      Category.find().sort([['name', 'ascending']]),
      Equipment.find(),
    ]);
    const categoriesAndEquipments = categories.map((category) => {
      const categoryEquipments = equipments.filter(
        (equipment) => equipment.category.toString() === category.id,
      );
      return {
        name: category.name,
        id: category.id,
        equipments: categoryEquipments,
      };
    });
    res.render('category/category_list', {
      categoryList: categoriesAndEquipments,
      title: 'Categories',
    });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const [category, categoryEquipments] = await Promise.all([
      Category.findById(req.params.id),
      Equipment.find({ category: req.params.id }),
    ]);
    if (!category) {
      const err: any = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category/category_detail', {
      category,
      categoryEquipments,
      title: `Category: ${category.name}`,
    });
  } catch (err) {
    next(err);
  }
};

const getCreateCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.render('category/category_form', { title: 'Create Category' });
};

const postCreateCategory = [
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    const category = new Category({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('category/category_form', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
      return;
    }
    try {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        res.redirect(`/category/${existingCategory.id}`);
      } else {
        await category.save();
        res.redirect(`/category/${category.id}`);
      }
    } catch (err) {
      next(err);
    }
  },
];

const getUpdateCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new Error('Category not found'));
  }
  res.render('category/category_form', {
    title: 'Update Category',
    name: category.name,
    update: true,
  });
};

const postUpdateCategory = [
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('name').custom(async (value) => {
    const existingCategory = await Category.findOne({ name: value });
    if (existingCategory) {
      throw new Error('Category already exists');
    }
  }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render('category/category_form', {
        title: 'Update Category',
        category,
        errors: errors.array(),
        update: true,
      });
      return;
    }
    try {
      const existingCategory = await Category.findOneAndUpdate(
        { _id: req.params.id },
        category,
      );
      res.redirect(`/category/${existingCategory?.id}`);
    } catch (err) {
      next(err);
    }
  },
];

const getDeleteCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const [category, categoryEquipments] = await Promise.all([
    Category.findById(req.params.id),
    Equipment.find({ category: req.params.id }),
  ]);
  if (!category) {
    return next(new Error('Category not found'));
  }
  res.render('category/category_delete', {
    title: `Delete Category: ${category.name}`,
    category,
    categoryEquipments,
  });
};

const postDeleteCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.redirect('/category');
  } catch (error) {
    next(error);
  }
};

export {
  getCategories,
  getCategory,
  getCreateCategory,
  postCreateCategory,
  getUpdateCategory,
  postUpdateCategory,
  getDeleteCategory,
  postDeleteCategory,
};
