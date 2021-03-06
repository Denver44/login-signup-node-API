import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

dotenv.config();

const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log(
      'Remote DB connection successful, database is ready to import & delete'
    );
  })
  .catch((e) => console.log(e));

//   Reading a Json File
const __dirname = path.resolve(path.dirname(''));

const fileName = ['users.json'];

const [user] = fileName.map((file) =>
  JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/${file}`))
);

const importData = async () => {
  try {
    await User.create(user, { validateBeforeSave: false });
    console.log('Data successfully imported');
  } catch (error) {
    console.log(error);
  }
  process.exit(); // To get exit from the process
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// console.log(process.argv);

if (process.argv.includes('import')) importData();
else if (process.argv.includes('delete')) deleteData();
