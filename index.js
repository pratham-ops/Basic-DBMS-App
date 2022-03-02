const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()
const port = process.env.PORT || 5000


app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/TestDb');

// Schema
const TestSchema = new mongoose.Schema({
    Name: { type: 'String', required: [true, 'Name Required'] },
    Phone: { type: 'Number', required: [true, 'Phone Required'], min: [10, 'Enter a valid Phone Number'] },
    Email: { type: 'String', required: [true, 'Email Required'] },
    Salary: { type: 'Number', required: [false, 'Salary Required'] },
    Department: { type: 'String', required: [false, 'Department Required'] }
});

// Model
const Practice = mongoose.model('Practice', TestSchema);

app.get('/', (req, res) => {
    // res.render("home")
    Practice.find((err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.render("home", { p: data });
        }
    })
});

app.get('/newpost', (req, res) => {
    res.render("newpost", { result: '' });
})

app.post('/delpost', (req, res) => {
    let pid = req.body.pid;
    Practice.findByIdAndDelete(pid, (err, data) => {
        if (!err) {
            // res.render('newpost', { result: '' });
            Practice.find((err, data) => {
                if (!err)
                    res.render("home", { p: data });
            })
        } else {
            console.log(err);
        }
    })
})

app.post('/new', (req, res) => {
    console.log(req.body)
    const FormData = new Practice({ Name: req.body.Name, Phone: req.body.Phone, Email: req.body.Email, Salary: req.body.Salary, Department: req.body.Department })
    FormData.save((err) => {
        if (!err) {
            res.render('newpost', { result: 'RECORD AAGYE HAIN BETA' })
        } else {
            console.log('Error in Code');
        }
    });
})

app.get('/updatepost/:objid', (req, res) => {
    let pid = req.params.objid;
    Practice.findById(pid, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.render("update", { pi: data, result: '' });
            // console.log(data);
        }
    })
})

app.post('/update', (req, res) => {
    let pid = req.body.pid
    const FormData = ({ Name: req.body.Name, Phone: req.body.Phone, Email: req.body.Email, Salary: req.body.Salary, Department: req.body.Department })
    Practice.findByIdAndUpdate(pid, FormData, (err) => {
        if (err) {
            console.error(err);
        } else {
            Practice.findById(pid, (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        res.render("update", { pi: data, result: 'Record Updated' });
                    }
                })
                // res.render("update", { pi: data, result: 'Record Updated' });
        }
    })
})


app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`)
})