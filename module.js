const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    phone: {
       required: true,
       type: Number,
    },
    age: {
      required: true,
      type: Number,
    },
    email: {
      required: true,
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('Task', taskSchema);
