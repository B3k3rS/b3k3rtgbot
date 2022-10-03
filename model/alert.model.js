const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertSchema = new Schema ({ 
    chat_id: {
        type: Number,
        required: true
    },
    alert_status: {
        type: Boolean,
        required: true
    }
})

mongoose.model('alert_schema',AlertSchema) 