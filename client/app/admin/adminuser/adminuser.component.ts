'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

export class AdminuserComponent {
  user;
  userID;
  errors = {};
  $http;
  budget;
  status;
  roles;
  NotifyService;
  isNew = true;

  constructor($state, $stateParams, $http, NotifyService) {
    this.NotifyService = NotifyService;
    this.$http = $http;
    this.budget = ["3000-5000", "5000-10000", "10000-20000", "20000-50000", "50000-100000", "100000-200000", "Over 200000"];
    this.status = ["New", "Approved", "Closed"];
    this.roles = ['user', 'agent', 'admin'];
    this.userID = $stateParams.userID;
    if (this.userID != '') {
      this.isNew = false;
      $http.get('/api/users/' + this.userID).then(response => {
        this.user = response.data;

      }).catch(function (data) {
        console.log(data);
      });
    }
  }

  saveUser(form) {

    if (this.isNew) {
      if (!form.$valid) {
        if (form.$error.mongoose) {
          form.$error.mongoose = [];
        }
        form.$valid = true;
      }

      if (form.$valid) {
        // Set the password to the username
        this.user.password = this.user.username;
        this.$http.post('/api/users/', this.user).then(response => {
          if (response.status == 200) {
            this.NotifyService.setData("Saved", "User saved successfully. Password is username");
            this.NotifyService.open("success");
          }
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
    } else {
      this.$http.put('/api/users/' + this.userID, this.user).then(response => {
        if (response.status == 200) {
          this.NotifyService.setData("Saved", "User saved successfully");
          this.NotifyService.open("success");

          // Reload the user
          this.$http.get('/api/users/' + this.userID).then(response => {
            //console.log(response.data);
            this.user = response.data;
          }).catch(function (data) {
            console.log(data);
          });
        } else {
          this.NotifyService.setData("Not Saved", "Error saving user");
          this.NotifyService.open("warning");
        }
      });
    }
  }

  setStatus(status) {
    this.user.status = status;
  }

  setBudget(budget) {
    this.user.budget = budget;
  }

  setRole(role) {
    this.user.role = role;
  }
}

export default angular.module('rlmsApp.adminuser', [uiRouter])
  .controller('AdminuserComponent', AdminuserComponent)
  .name;
