let mongoose = require('mongoose');

Schema = mongoose.Schema;

let IssueSchema = new mongoose.Schema({
        // issuesId: Schema.Types.ObjectId,
        category: String,
        status: {type: Boolean , default: false},
        text: String,
        solutions: []
    },
    { collection: 'Issues' });

module.exports = mongoose.model('issues', IssueSchema);
