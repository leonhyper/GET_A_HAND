let mongoose = require('mongoose');
Schema = mongoose.Schema;

let SolutionSchema = new mongoose.Schema({
        solutionId: Schema.Types.ObjectId,
        parent: String,
        text: String,
        like: {type: Number, default: 0},
    },
    { collection: 'Solutions' });

module.exports = mongoose.model('solutions', SolutionSchema);
