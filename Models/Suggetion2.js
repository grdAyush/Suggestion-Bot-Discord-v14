const { Schema, model } = require('mongoose');

const sug = new Schema({
    id: String,
    suggestion:String
})

module.exports = model("Suggetion2", sug);