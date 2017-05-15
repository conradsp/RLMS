'use strict';

import mongoose from 'mongoose';

var PhotoSchema = new mongoose.Schema({
  filename: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Photo', PhotoSchema);
