const mongoose = require('mongoose');

const MarkerSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  taste: {
    type: Number,
    required: true,
  },
  free: {
    type: Boolean,
    required: true,
  },
  fiability: {
    type: Number,
    default: 1
  },
  fiabilityVoters: {
    type: String,
    required: true,
  },
  deleteVotes: {
    type: Number,
    default: 0
  },
  deleteVoters: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  undeletable: {
    type: Boolean,
    default: false
  }
});

const Marker = mongoose.model('Marker', MarkerSchema);

module.exports = Marker;
