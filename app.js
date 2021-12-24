import express from "express"
import fs from 'fs'
import path from 'path'
const app = express()
const PORT = 5000;

app.use(express.json())


const __dirname = path.resolve(path.dirname(''));
let tours = [];
tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    })
}
const getATour = (req, res) => {
    const { id } = req.params
    const tour = tours.find(el => el.id === id * 1)

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

const createATour = (req, res) => {
    const { body } = req
    const id = tours[tours.length - 1].id + 1;
    const tour = { ...body, id }
    tours = [...tours, tour];
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "created",
            data: {
                tour
            }
        })
    })
}

const updateATour = (req, res) => {
    const { body } = req
    const id = req.params.id
    const tour = tours.find(el => el.id === id * 1)


    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }

    let updatedTour = tours.find(el => el.id === id * 1)
    let filteredTour = tours.filter((el) => el.id !== id * 1)
    updatedTour = { id: id * 1, ...body }
    tours = [...filteredTour, updatedTour];

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: "updated",
            data: {
                tour: updatedTour
            }
        })
    })
}

const deleteATour = (req, res) => {
    const id = req.params.id
    const tour = tours.find(el => el.id === id * 1)

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }

    let filteredTour = tours.filter((el) => el.id !== id * 1)
    tours = [...filteredTour];

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(204).json({
            status: "success"
        })
    })
}

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getATour)
// app.post('/api/v1/tours', createATour)
// app.patch('/api/v1/tours/:id', updateATour)
// app.delete('/api/v1/tours/:id', deleteATour)

app.route('/api/v1/tours').get(getAllTours).post(createATour)
app.route('/api/v1/tours/:id').get(getATour).patch(updateATour).delete(deleteATour)

app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})
