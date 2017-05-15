'use strict';

import mongoose from 'mongoose';

var LotSchema = new mongoose.Schema({
  lotnum: Number,
  seller: String,
  seller_id: String,
  agent: String,
  lot_name: String,
  quantity: Number,
  desc: String,
  active: Boolean,
  district: String,
  photos: [ {filename: String }],
  category: String,
  lot_type: String,
  livestock_type: String,
  pricing_unit: String,
  status: String,
  marking: String,
  paint_mark: String,
  avg_weight: Number,
  top_weight: Number,
  bottom_weight: Number,
  payment_info: String,
  close_date: Date,
  current_bid: Number,
  teeth: {
    mt: Number,
    twot: Number,
    fourt: Number,
    sixt: Number,
    fm: Number
  },
  animals: [{
    tag_number: String,
    class: String,
    age_class: String,
    breed: String,
    weight: Number,
    age_months: Number,
    age_teeth: Number,
    grade: String,
    min_lactation: Number,
    max_lactation: Number,
    num_calf: Number,
    male_calf: Number,
    female_calf: Number,
    dress_pct: Number,
    quantity: Number,
    photo: String
  }],
  lot_groups: [{
    name: String,
    photos: [{filename: String}],

  }],
  bids: [{
    user_id: String,
    bid_amount: Number,
    user_name: String,
    bid_date: Date
  }],
  watching: [{
    user_id: String,
    user_name: String,
    _id: false
  }]
});

// Create indexes
LotSchema.index(
  {
    lot_name: "text",
    desc: "text",
    seller: "text",
    category: "text",
    livestock_type: "text"
  }
);


export default mongoose.model('Lot', LotSchema);
