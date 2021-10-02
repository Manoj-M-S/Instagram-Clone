var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema.Types;

var postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    photo: {
      type: String,
      required: true,
    },
    like: [{ type: Object, ref: "User" }],
    comment: [
      {
        text: String,
        postedBy: { type: Object, ref: "User" },
        id: { type: ObjectId },
      },
    ],
    postedBy: { type: Object, required: true },
    userId: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
