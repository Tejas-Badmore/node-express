const mongoose =require('mongoose');

const employeeSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,    
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    }
});

var employeedata=mongoose.model('employeedata',employeeSchema);
module.exports= employeedata;