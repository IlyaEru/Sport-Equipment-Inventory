import express from 'express';

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

export default router;
