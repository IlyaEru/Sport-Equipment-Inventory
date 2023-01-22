#! /usr/bin/env node
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import localStorageDB from './src/config/test-db';
dotenv.config();

import Category from './src/components/category/category.model';
import Equipment from './src/components/equipment/equipment.model';
import Inventory from './src/components/inventory/inventory.model';
import Location from './src/components/location/location.model';

console.log(
  'This script populates some test data like categories, equipments, locations and inventory to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url',
);

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_DB_ATLAS_URI!);
// localStorageDB.setUp();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// populated data

const categories = ['soccer', 'basketball', 'tennis', 'volleyball'];

const equipments = [
  {
    name: 'Nike Mercurial Vapor 13 Elite FG',
    category: 'soccer',
    description:
      'Elite-level soccer cleat with lightweight design and precision touch',
    price: 250,
  },
  {
    name: 'Adidas X Ghosted+ FG',
    category: 'soccer',
    description:
      'High-performance soccer cleat with a lightweight and responsive design',
    price: 220,
  },
  {
    name: 'Puma Future 5.1 Netfit FG/AG',
    category: 'soccer',
    description:
      'Innovative soccer cleat with a customizable fit and lightweight design',
    price: 200,
  },
  {
    name: 'Nike LeBron 17 Low',
    category: 'basketball',
    description:
      'Low-top basketball shoe with Zoom Air cushioning and a durable design',
    price: 160,
  },
  {
    name: 'Jordan Why Not Zer0.4',
    category: 'basketball',
    description:
      'Signature shoe of Russell Westbrook with a responsive design and traction',
    price: 140,
  },
  {
    name: 'Adidas Harden Vol. 4',
    category: 'basketball',
    description:
      'Signature shoe of James Harden with a responsive Boost midsole and traction',
    price: 130,
  },
  {
    name: 'Wilson Pro Staff RF97 Autograph',
    category: 'tennis',
    description:
      "Roger Federer's signature tennis racket with a classic, player-inspired design",
    price: 250,
  },
  {
    name: 'Babolat Pure Drive Plus',
    category: 'tennis',
    description:
      'Powerful and responsive tennis racket with a larger sweet spot',
    price: 200,
  },
  {
    name: 'Head Speed Pro',
    category: 'tennis',
    description:
      'Powerful and maneuverable tennis racket with a larger sweet spot',
    price: 190,
  },
  {
    name: 'Mikasa VLS300',
    category: 'volleyball',
    description:
      'Official game ball of the NCAA with a durable and responsive design',
    price: 50,
  },
  {
    name: 'Tachikara SV-5WSC',
    category: 'volleyball',
    description:
      'Official game ball of the USA Volleyball with a soft and responsive design',
    price: 45,
  },
  {
    name: 'Molten V5M5000-3N',
    category: 'volleyball',
    description:
      'Official game ball of the FIVB with a durable and responsive design',
    price: 40,
  },
];

const locations = [
  {
    name: 'New York Store',
    address: '123 Main St, New York, NY 10001',
    inventory: [],
  },
  {
    name: 'Los Angeles Store',
    address: '456 Sunset Blvd, Los Angeles, CA 90001',
    inventory: [],
  },
  {
    name: 'Chicago Store',
    address: '789 Michigan Ave, Chicago, IL 60601',
    inventory: [],
  },
];

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const populate = async () => {
  // insert the categories into the database
  await Category.insertMany(categories.map((c) => ({ name: c })));

  // insert the locations into the database
  await Location.insertMany(locations);

  // get the categories from the database
  const generatedCategories = await Category.find({}).exec();

  // get the locations from the database
  const generatedLocations = await Location.find({}).exec();

  // insert the equipments into the database
  await Equipment.insertMany(
    equipments.map((e) => ({
      ...e,
      category: generatedCategories.find((c) => c.name === e.category)?._id,
    })),
  );

  // get the equipments from the database
  const generatedEquipments = await Equipment.find({}).exec();

  // returns a random location id
  const getRandomLocationId = () => {
    const randomIndex = getRandomNumber(0, generatedLocations.length - 1);
    return generatedLocations[randomIndex]._id;
  };

  // creates some random inventory data
  const randomInventoryData = generatedEquipments.flatMap((e) => [
    {
      equipment: e._id,
      location: getRandomLocationId(),
      quantity: getRandomNumber(0, 10),
    },
    {
      equipment: e._id,
      location: getRandomLocationId(),
      quantity: getRandomNumber(0, 10),
    },
  ]);

  // insert the inventory data into the database
  await Inventory.insertMany(randomInventoryData);

  // print the result to the console

  console.log('done');
  console.log('category amount:' + (await Category.countDocuments({})));
  console.log('equipment amount:' + (await Equipment.countDocuments({})));
  console.log('location amount:' + (await Location.countDocuments({})));
  console.log('inventory amount:' + (await Inventory.countDocuments({})));
};
populate();
