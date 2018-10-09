let issues = require('../models/issues');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/issuesdb');

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    issues.find(function(err, issues) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(issues,null,5));
    });
}

router.findById = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    // var result = [];
    // for(var issue in issues) {
    //     if (issue._id.ObjectId.search(req.params.id) != -1)
    //         result.push(issue);
    // }
    //     if(result!=null)
    //         res.send(JSON.stringify(result,null,5));
    //     else
    //         res.send("Issue not found!");


    issues.find({ "_id" : req.params.id },function(err, issue) {
        if (err)
            res.send(err);
        // return a suitable error message
        else
            res.send(JSON.stringify(issue,null,5));
        // return the donation
    });
}

router.findByCate = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var result = [];
    var text = req.params.category;
    issues.forEach(function(issue){
        if(issue.category.toUpperCase().search(text.toUpperCase())>-1){
            result.push(issue);
        }
    })

    if (result != null)
        res.send(JSON.stringify(result,null,5));
    else
        res.send('Category NOT Found!!');

}
router.findByStatus = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
     var result = [];
     issues.forEach(function(issue){
         if(issue.status.toString() == req.params.status){
             result.push(issue);
         }
     })

    if (result != null)
        res.send(JSON.stringify(result,null,5));
    else
        res.send('Issues NOT Found!!');

}
router.addIssue = (req, res) => {
    //Add a new donation to our list
    var id = issues[issues.length-1].id+1; //Randomly generate an id
    var currentSize = issues.length;

    issues.push({"id" : id, "category" : req.body.category, "status" : false, "solution" : 0, "solutionList" : []});

    if((currentSize + 1) == issues.length)
        res.json({ message: 'Issue Added Successfully!'});
    else
        res.json({ message: 'Issue NOT Added!'});
}

router.updateStatus = (req, res) =>{
    //find a certain issue by id and update 'unsolved'(false) status to 'solved'(true) status
    var issue = getByValue(issues, req.params.id);

    if(issue != null){
        issue.status = true;
        res.json({ message : 'Update Successful.Issue set solved' , issue : issue });
    }else
        res.send('Issue NOT Found - Update NOT Successful!!');
}

router.deleteIssue = (req, res) =>{
    //delete a certain issue by id
    var issue = getByValue(issues, req.params.id);
    var index = issues.indexOf(issue);
    var currentSize = issues.length;
    issues.splice(index, 1);

    if((currentSize - 1) == issues.length)
        res.json({ message: 'Issue Deleted!'});
    else
        res.json({ message: 'Issue NOT Deleted!'});
}
function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}


module.exports = router;