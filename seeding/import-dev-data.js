import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../models/tourModel.js';

dotenv.config();

const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((con) => {
    console.log('Remote DB connection successful');
  })
  .catch((e) => console.log(e));

//   Reading a Json File
const __dirname = path.resolve(path.dirname(''));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// IMPORT Data from a Database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
  } catch (error) {
    console.log(error);
  }
  process.exit(); // To get exit from the process
};

// DELETE all Data from a Database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === 'delete') {
  deleteData();
}