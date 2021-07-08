const express = require('express');
const bodyParser = require('body-parser');
const empRouter = express.Router();

const Employee= require('../models/employee.js');
const MongoClient = require('mongodb').MongoClient

empRouter.use(bodyParser.json());

const connString = "mongodb+srv://tejas:tej123456@cluster0.zgqba.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(connString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database Successfully!!')
    const db = client.db('employee-details');
    const empCollection = db.collection('employees');

    empRouter.route('/')
    .get( (req,res,next) => {
        // res.end('Will send all the employees to you!');
        console.log("Getting All Employees");
        const cursor = db.collection('employees').find({}).toArray().then((emp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(emp);
        }, (err) => next(err))
        .catch((err) => next(err));
        console.log(cursor)
        

    })
    .post( (req, res, next) => {
        //res.end('Will add the employee: ' + req.body.name + ' with age: ' + req.body.age);
        console.log("Employees Adding");
        
        const newEmp = new Employee({
            id:req.body.id,
            name:req.body.name,
            age:req.body.age
        });
        empCollection.insertOne(newEmp)
        .then(result => {
            console.log(result)
            console.log('Employee Created ', newEmp);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(newEmp);
        })
        .catch(error => console.error(error))
    })
    .put( (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /employee');
    })
    .delete( (req, res, next) => {
        //res.end('Deleting all employees');
        console.log("All Employees Deleted");
        empCollection.deleteMany().then((emp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.write("All Employees Deleted")
        }, (err) => next(err))
        .catch((err) => next(err));
    });

    empRouter.route('/:empId')
    .get((req,res,next) => {
        //res.end('Will send details of the employee ID: ' + req.params.empId +' to you! , now');
        const id= parseInt(req.params.empId);
        empCollection.findOne({"id":id})
        .then((emp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(emp);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('POST operation not supported on /employee/'+ req.params.empId);
    })
    .put((req, res, next) => {
        console.log('Updating the employee with ID: ' + req.params.empId + '\n');
        console.log('\nWill update the employee: ' + req.body.name + 
            ' with age: ' + req.body.age);
        const id= parseInt(req.params.empId);
        empCollection.findOneAndUpdate({"id":id},{
            $set: req.body
        }, { new: true })
        .then((emp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(emp);
        }, (err) => next(err))
        .catch((err) => next(err));
        
    })
    .delete((req, res, next) => {
        console.log('Deleting employee ID: ' + req.params.empId);
        const id= parseInt(req.params.empId);
        empCollection.findOneAndDelete({"id":id})
        .then((emp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(emp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

  })
  .catch(error => console.error(error))

  /*
//---------------------------for /empoyee---------------------------

//this func will be called 1st by default using 'all' method
empRouter.route('/')
    .get( (req,res,next) => {
        // res.end('Will send all the employees to you!');
        console.log("Getting All Employees");
        Employee.find({})
        .then((emp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(emp);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post( (req, res, next) => {
        //res.end('Will add the employee: ' + req.body.name + ' with age: ' + req.body.age);
        console.log("Employees Adding");
        console.log(req.body);
        const newEmp = new Employee({
            id:req.body.id,
            name:req.body.name,
            age:req.body.age
        });
        try{
            console.log('Employee Created ', newEmp);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(newEmp);
        }catch(error)
        {
            res.status(402).json({message: error.message});
        }
    })
    .put( (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /employee');
    })
    .delete( (req, res, next) => {
        //res.end('Deleting all employees');
        console.log("All Employees Deleted");
        Employee.remove({})
        .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

//---------------------------for /empoyee/:empId---------------------------

empRouter.route('/:empId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the employee ID: ' + req.params.empId +' to you! , now');
})
.post((req, res, next) => {
    res.statusCode = 403;
  res.end('POST operation not supported on /employee/'+ req.params.empId);
})
.put((req, res, next) => {
    res.write('Updating the employee with ID: ' + req.params.empId + '\n');
    res.end('\nWill update the employee: ' + req.body.name + 
          ' with age: ' + req.body.age);
})
.delete((req, res, next) => {
    res.end('Deleting employee ID: ' + req.params.empId);
});
*/

module.exports = empRouter;