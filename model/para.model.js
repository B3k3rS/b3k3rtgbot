const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParaSchema = new Schema ({
    numerator: {
        type: Boolean,
        required: true
    },
    dayofweek: {
        type: Number,
        required: true
    },
    counter: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

mongoose.model('para_schema',ParaSchema)
