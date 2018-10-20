let issues = require('../models/issues');
let solutions = require('../models/solutions');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let db = mongoose.connection;

var ObjectId = require('mongodb').ObjectId;

mongoose.connect('mongodb://localhost:27017/issuesdb');

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAllIssues = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    issues.find(function(err, issues) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(issues,null,5));
    });
}

router.findById = (req, res) => {

    // res.setHeader('Content-Type', 'application/json');
    // var result = [];
    // issues.find().forEach(function(obj){
    //     if (obj._id.search(req.params.id) != -1)
    //         result.push(obj);
    // })
    //     if(result!=null)
    //         res.send(JSON.stringify(result,null,5));
    //     else
    //         res.send("Issue not found!");


    issues.find({ "_id" :req.params.id },function(err, issue) {
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

    var whereStr = {'category':{$regex:req.params.category,$options:'i'}};

    issues.find(whereStr ,function(err, issue) {
        if (err)
        res.send(err);
        // return a suitable error message
        else
            res.send(JSON.stringify(issue,null,5));
        // return the donation
    });

    // var result = [];
    // var text = req.params.category;
    // for(var obj in issues){
    //     if(obj.category === text){
    //         result.push(obj);
    //     }
    // }
    //
    // if (result != null)
    //     res.send(JSON.stringify(result,null,5));
    // else
    //     res.send('Category NOT Found!!');

}

router.findByStatus = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    issues.find({ status :req.params.status },function(err, issue) {
        if (err)
            res.send(err);
        // return a suitable error message
        else
            res.send(JSON.stringify(issue, null, 5));
    })
    //  var result = [];
    //  issues.forEach(function(issue){
    //      if(issue.status.toString() == req.params.status){
    //          result.push(issue);
    //      }
    //  })
    //
    // if (result != null)
    //     res.send(JSON.stringify(result,null,5));
    // else
    //     res.send('Issues NOT Found!!');

}
router.addIssue = (req, res) => {
    //Add a new donation to our list
    // var id = issues[issues.length-1].id+1; //Randomly generate an id
    // var currentSize = issues.length;
    //
    // issues.push({"id" : id, "category" : req.body.category, "status" : false, "solution" : 0, "solutionList" : []});
    //
    // if((currentSize + 1) == issues.length)
    //     res.json({ message: 'Issue Added Successfully!'});
    // else
    //     res.json({ message: 'Issue NOT Added!'});
    res.setHeader('Content-Type', 'application/json');

    var issue = new issues();

    issue.category = req.body.category;
    // issue.issuesId = new mongoose.Types.ObjectId;

    issue.save(function(err) {
        if (err)
            res.json({ message: 'Issue NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Issue Successfully Added!', data: issue });
    });
}

router.updateStatus = (req, res) =>{
    //find a certain issue by id and update 'unsolved'(false) status to 'solved'(true) status
    // var issue = getByValue(issues, req.params.id);
    //
    // if(issue != null){
    //     issue.status = true;
    //     res.json({ message : 'Update Successful.Issue set solved' , issue : issue });
    // }else
    //     res.send('Issue NOT Found - Update NOT Successful!!');
    issues.findById(req.params.id, function(err,issue){
        if (err)
            res.json({ message: 'Donation NOT Found!', errmsg : err } );
        else{
            issue.status = req.params.status;
            issue.save(function (err) {
                if (err)
                    res.json({ message: 'Issue NOT Updated to Solved!', errmsg : err } );
                else
                    res.json({ message: 'Issue Successfully Set Solved!', data: issue });
            });
        }
    })
}

router.deleteIssue = (req, res) =>{
    //delete a certain issue by id
    // var issue = getByValue(issues, req.params.id);
    // var index = issues.indexOf(issue);
    // var currentSize = issues.length;
    // issues.splice(index, 1);
    //
    // if((currentSize - 1) == issues.length)
    //     res.json({ message: 'Issue Deleted!'});
    // else
    //     res.json({ message: 'Issue NOT Deleted!'});
    issues.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Issue NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Issue Successfully Deleted!'});
    });
}


router.findAllSolutions = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    solutions.find(function(err, solutions) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(solutions,null,5));
    });
}

router.findSolutionById = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    solutions.find({ solutionId:req.params.id},function (err,solution) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(solution,null,5));
    })
}

router.findByParent = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    var result = {
        parent:{
            id: String,
            category: String,
            status: Boolean
        },
        solutionList: []
    };
    issues.findById(req.params.id,function(err,issue){
        if(err)
            res.json({ message: 'Parent Issue NOT Found!', errmsg : err });
        else{
            if(issue.solutions.length==0)
                res.json({message: 'Sorry.This issue still has no solutions', data: issue});
            else{
                var i = 0;
                result.parent.id = issue._id;
                result.parent.category = issue.category;
                result.parent.status = issue.status;
                issue.solutions.forEach(function(id){
                    // console.log(id);
                    solutions.find({solutionId: id},function(err,solution)
                    {
                        if(err)
                            res.send(err);
                        else{
                            i++;
                            result.solutionList.push(solution);
                            if(i == issue.solutions.length)
                                res.send(JSON.stringify(result,null,5));
                        }
                    });
                });
            }
        }
    });
}

router.increaseLike = (req,res) => {

    solutions.findOne({"solutionId": req.params.id},function (err,solution) {
        if(err)
            res.json({ message: 'Solution NOT Found!', errmsg : err });
        else{
            solution.like ++;
            // solution.save(function (err) {
            //     res.json({message: "Like successfully increased by 1.", data: solution});
            // })
            solution.save(function(err){
                if(err)
                    res.json({ message: 'Adding like failed!', errmsg : err } );
                else {
                    res.json({message: "Like successfully increased by 1.", data: solution});
                }
            })
        }
    })
}


router.addSolution = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var solution = new solutions();

    solution.parent = req.body.parent;
    solution.solutionId = new mongoose.Types.ObjectId;

    issues.findById(req.body.parent,function(err,issue){
        if(err)
            res.json({ message: 'Parent Issue NOT Found! Solution NOT Added!', errmsg : err });
        else{
            solution.save(function(err){
                if(err){
                    res.json({ message: 'Solution NOT Added!', errmsg : err } );
                }
                else{
                    issue.solutions.push(solution.solutionId);
                    issue.save(function (err) {
                        if(err)
                            res.json({ message: 'Solution NOT Added!', errmsg : err } );
                        else
                            res.json({message: 'solution Successfully Added!', data: solution});
                    });
                }
            })
        }
    })

    // solution.save(function(err){
    //     if(err){
    //         res.json({ message: 'Solution NOT Added!', errmsg : err } );
    //     }
    //     else{
    //         issues.findById(req.params.id, function(err,issue){
    //             issue.solutions.push(solution.solutionId);
    //             issue.save(function (err) {
    //                 if(err)
    //                     console.log(errmsg);
    //             });
    //             res.json({message: 'solution Successfully Added!', data: solution});
    //         })
    //     }
    //
    // })

}

// router.deleteSolution = (req,res) => {
//     solutions.findByIdAndRemove(req.params.id, function(err) {
//         if (err)
//             res.json({ message: 'Solution NOT DELETED!', errmsg : err } );
//         else
//             res.json({ message: 'Solution Successfully Deleted!'});
//     });
// }

router.getParentIssue = (req,res) => {

    solutions.findOne({solutionId: req.params.id},function (err,solution) {
        if(err)
            res.json({ message: 'Solution Does Not Exist!', errmsg : err } );
        else{
            issues.findById({_id: solution.parent},function(err,issue){
                if(err)
                    res.json({ message: 'Parent Issue Not Found!', errmsg : err } );
                else
                    res.json({ message: 'Parent Issue Found!',data: issue});
            })
        }
    })

}

router.deleteSolution = (req,res) => {
    res.setHeader('Content-Type', 'application/json');

    solutions.remove({solutionId: req.params.id},function(err,solution){
        var s = solution.solutionId;
        if(err)
            res.json({ message: 'Solution Does Not Exist!', errmsg : err } );
        else{
            issues.update({"_id":solution.parent},{$pull:{solutions:s}},function(err,issue){
                if(err)
                    res.send(err);
                else{
                    res.json({message:'wow',data:issue,solution});
                }
            })
        }
    })

}


module.exports = router;