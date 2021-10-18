const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const discussionSchema = new Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  replies: [
    {
      username: { type: String },
      reply: { type: String }
    }
  ]
});

module.exports = mongoose.model('Discussion', discussionSchema);