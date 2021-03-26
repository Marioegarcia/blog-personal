const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const PostSchema = Schema({
  title: String,
  url: {
    type: String,
    unique: true
  },
  description: String,
  content: String,
  categoria: String,
  tags:[{type: String}],
  img: String,
  path: String,
  date: Date
});
PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", PostSchema);