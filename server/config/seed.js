/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Lot from '../api/lot/lot.model';
import Content from '../api/content/content.model';
import User from '../api/user/user.model';

Lot.find({}).remove()
  .then(() => {
    Lot.create({
      lotnum: 1,
      lot_name: 'Lot 1',
      desc: 'Bulls for Sale',
      seller: 'Steve Conrad',
      seller_id: '',
      quantity: 5,
      district: 'Ruwa',
      active: true,
      photos: [ {filename: 'assets/images/uploads/8bb4d5e9-5793-4c7f-aac1-b9488fdf637d.jpg'} ],
      category: 'Breeding',
      lot_type: 'Individual',
      livestock_type: 'Cattle',
      pricing_unit: '$/lot',
      status: 'Open',
      marking: 'SPC',
      paint_mark: 'SPC',
      avg_weight: 500,
      top_weight: 650,
      bottom_weight: 400,
      payment_info: 'Cash only',
      close_date: new Date(),
      current_bid: 0,
      animals: [{
        tag_number: 12,
        class: "Bull",
        age_class: "Draft",
        breed: "Jersey",
        weight: 1000,
        age_months: 12,
        age_teeth: 4,
        grade: "Prime",
        min_lactation: 2,
        max_lactation: 12,
        num_calf: 2,
        male_calf: 2,
        female_calf: 0,
        dress_pct: 44,
        quantity: 1,
        photo: "assets/images/uploads/c765888b-51f3-4345-95a6-9ab6d38bf5c9.jpg"
      },{
        tag_number: 13,
        class: "Bull",
        age_class: "Draft",
        breed: "Jersey",
        weight: 1000,
        age_months: 12,
        age_teeth: 4,
        grade: "Prime",
        min_lactation: 2,
        max_lactation: 12,
        num_calf: 2,
        male_calf: 2,
        female_calf: 0,
        dress_pct: 54,
        quantity: 1,
        photo: "assets/images/uploads/d7fe9dba-1391-4e79-a18c-800db8e7fdc5.png"
      }]
    }, {
      lotnum: 2,
      lot_name: 'Lot 2',
      desc: 'Pigs - lots of pigs',
      seller: 'Allister Banks',
      seller_id: '',
      quantity: 5,
      district: 'Ruwa',
      active: true,
      photos: [ {filename: 'assets/images/uploads/c765888b-51f3-4345-95a6-9ab6d38bf5c9.jpg'}, {filename: 'assets/images/uploads/d7fe9dba-1391-4e79-a18c-800db8e7fdc5.png'} ],
      category: 'Slaughter',
      lot_type: 'Group',
      livestock_type: 'Pigs',
      pricing_unit: '$/lot',
      status: 'Closed',
      marking: 'SPC',
      paint_mark: 'SPC',
      avg_weight: 500,
      top_weight: 650,
      bottom_weight: 400,
      current_bid: 0,
      close_date: '2017/01/09'
    }, {
      lotnum: 3,
      lot_name: 'Lot 3',
      desc: 'Finally, some cattle',
      seller: 'Allister Banks',
      seller_id: '',
      quantity: 5,
      district: 'Harare',
      active: true,
      photos: [ {filename: 'assets/images/uploads/c765888b-51f3-4345-95a6-9ab6d38bf5c9.jpg'}, {filename: 'assets/images/uploads/d7fe9dba-1391-4e79-a18c-800db8e7fdc5.png'} ],
      category: 'Slaughter',
      lot_type: 'Group',
      livestock_type: 'Pigs',
      pricing_unit: '$/lot',
      status: 'Waiting',
      marking: 'SPC',
      paint_mark: 'SPC',
      avg_weight: 500,
      top_weight: 650,
      bottom_weight: 400,
      current_bid: 0,
      close_date: '2017/01/12'
    });
  });


Content.find({}).remove()
  .then(() => {
    Content.create({
        name: 'Bulls',
        short_desc: 'Bulls for stud',
        long_desc: 'Lot of 3 bulls, ready for stud',
        image: 'assets/images/img19.jpg',
        html: '/admin/lotlist',
        active: true
      },
      {
        name: 'Cows',
        short_desc: 'Cows for sale',
        long_desc: 'Lot of 3 bulls, ready for stud',
        image: 'assets/images/img19.jpg',
        html: '/calendar',
        active: true
      });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      fullname: 'Steve Conrad',
      role: 'admin',
      username: 'conradsp',
      email: 'sconrad1@gmail.com',
      password: 'slime99',
      status: 'Approved',
      livestocktype: { cattle: true }
    }, {
      provider: 'local',
      role: 'agent',
      fullname: 'Test Agent',
      email: 'agent@rlmszw.com',
      username: 'agent@rlmszw.com',
      password: 'agent',
      status: 'New'
    }, {
      provider: 'local',
      role: 'agent',
      fullname: 'Admin',
      email: 'admin@rlmszw.com',
      username: 'admin@rlmszw.com',
      password: 'admin',
      status: 'Approved'
    }, {
      provider: 'local',
      fullname: 'Test User',
      status: 'Approved',
      email: 'test@rlmszw.com',
      username: 'test@rlmszw.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      status: 'Approved',
      fullname: 'Allister Banks',
      email: 'allister@rlmszw.com',
      username: 'allister@rlmszw.com',
      password: 'admin'
    })
      .then(() => {
        console.log('finished populating users');
      });
  });
