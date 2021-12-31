import Tour from '../models/tourModel.js';
import { spiltHelper } from '../utils/helper.js';

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // Building Query

    // 1 Filtering
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2 Advanced Filtering
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);

    let tourQuery = Tour.find(JSON.parse(queryStr));

    //3. Sorting
    if (req.query.sort) {
      const tourSortQuery = spiltHelper(req.query.sort, ',', ' ');
      tourQuery = tourQuery.sort(tourSortQuery);
    } else {
      tourQuery = tourQuery.sort('-createdAt'); // As by default we want our latest post to be first
    }

    //4. Limiting
    if (req.query.fields) {
      const tourLimitQuery = spiltHelper(req.query.fields, ',', ' ');
      tourQuery = tourQuery.select(tourLimitQuery);
    } else {
      tourQuery = tourQuery.select('__v');
    }

    //5. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log('skip page limit', skip, page, limit);

    tourQuery = tourQuery.skip(skip).limit(limit);

    // Executing Query
    const tours = await tourQuery;
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const getATour = async (req, res) => {
  try {
    const { id } = req.params;
    const aTour = await Tour.findById(id);
    // const aTour = await Tour.findOne({ _id: id });

    res.status(200).json({
      status: 'success',
      data: {
        tour: aTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createATour = async (req, res) => {
  try {
    const { body } = req;
    const newTour = await Tour.create(body);

    res.status(201).json({
      status: 'created',
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

const updateATour = async (req, res) => {
  try {
    const { body } = req;
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true, // It will return the new update data
      runValidators: true, // It will run the validators on the body
    });

    res.status(200).json({
      status: 'updated',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const deleteATour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

export { createATour, getATour, getAllTours, deleteATour, updateATour };

/*

1st way of doing query, but this method is more feasible
Tour.find({duration : 5 , difficult : easy});

2nd Way of doing query

Tour.find().where("duration").equals(5).where("difficult").equals(easy)
Tour.find().where("duration").gte(5).where("difficult").equals(easy).price.lte(500)
Tour.find().where("duration").sort(1)
Tour.find().where("duration").sort(-1)

*/
