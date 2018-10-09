let mongoose = require('mongoose');

let IssueSchema = new mongoose.Schema({
        category: String,
        status: Boolean ,
        solutions: []
    },
    { collection: 'issuesdb' });

module.exports = mongoose.model('Issue', IssueSchema);