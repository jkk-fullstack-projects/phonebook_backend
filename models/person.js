const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(val) {
        return (/(0([0-9]{2})-([0-9]{4}))/).test(val);
      },
      message: 'This is not a valid phone number'
    },
    minlength: 7,
    maxlength: 12,
    required: [true, 'User phone number required']
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);

