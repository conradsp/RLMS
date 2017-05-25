'use strict';
// @flow
const angular = require('angular');


export default class SignupController {

  user;
  errors = {};
  submitted = false;
  isView = false;
  isMe = false;
  termsAccepted = false;
  Auth;
  $state;
  $http;
  NotifyService;
  buysell;
  categories;
  livestock_types;
  budget;
  status;

  //end-non-standard

  constructor(Auth, User, $state, NotifyService, $http) {
    'ngInject';
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
    this.NotifyService = NotifyService;
    if ($state.params.status == 'view') {
      this.isView = true;
      $http.get('/api/users/'+User._id).then(response => {
        this.user = response.data;
      });
    } else if($state.params.status == 'update') {
      this.isMe = true;
      this.user = Auth.getCurrentUserSync();
    }
    this.buysell = ["Buy", "Sell", "Both"];
    this.budget = ["3000-5000", "5000-10000", "10000-20000", "20000-50000", "50000-100000", "100000-200000", "Over 200000"];
    this.status = ["New", "Approved", "Suspended"];
  }

  register(form) {
    var that=this;
    this.errors = {};
    this.submitted = true;
    if (this.$state.params.status == "new")
      this.user.status = "New";

    // Clear any mongoose errors
    if (!form.$valid) {
      if (form.$error.mongoose) {
        form.$error.mongoose = [];
      }
      form.$valid = true;
    }

    // Validation is done before register is called
    if (form.$valid) {
      this.$http.post('/api/users/', this.user).then(response => {
          // Account created, redirect to home
          this.NotifyService.setData(this.user.fullname, "You have successfully registered. Please log in.");
          this.NotifyService.open("success");
          this.$state.go('login');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });

        });
    }

  }

  updateUser()
  {
    this.$http.put('/api/users/'+this.user._id, this.user).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Saved", "User updated successfully");
        this.NotifyService.open("success");
      }
    });
  }

  setBrand(val) {
    this.user.brand = val;
  }

  getBrand() {
    return 'Yes';
  }

  setBuySell(buysell) {
    this.user.buysell = buysell;
  }

}
