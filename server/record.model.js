const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    value: { type: Number, required: true },
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

mongoose.model('record', recordSchema);