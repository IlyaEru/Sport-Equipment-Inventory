import express from 'express';

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import categoryRoutes from '../components/category';
import equipmentRoutes from '../components/equipment';
import inventoryRoutes from '../components/inventory';
import locationRouter from '../components/location';
import homeRouter from '../components/home';

const router = express.Router();

router.use('/', homeRouter);
router.use('/category', categoryRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/location', locationRouter);

// route to get the admin password as a json object

router.get('/admin', (req, res) => {
  const password = process.env.ADMIN_PASSWORD;
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    res.json({ password: hashedPassword });
  } else {
    res.json({ password: '' });
  }
});

export default router;
