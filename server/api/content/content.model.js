'use strict';

import mongoose from 'mongoose';

var ContentSchema = new mongoose.Schema({
  name: String,
  short_desc: String,
  long_desc: String,
  image: String,
  link: String,
  active: Boolean
});

export default mongoose.model('Content', ContentSchema);
