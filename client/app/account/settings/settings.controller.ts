'use strict';
const angular = require('angular');

export default class SettingsController {
  errors;
  submitted;
  Auth;
  currentUser;
  user;
  message;
  messageCount = 0;
  totalMessages = 0;
  budget;
  LotService;
  $location;
  $http;
  $q;
  isLoading = false;
  tableState = null;
  showMessageForm = false;
  messageText;
  NotifyService;

  constructor(Auth, $http, $q, LotService, $location, NotifyService) {
    'ngInject';
    this.errors = {};
    this.submitted = false;
    this.LotService = LotService;
    this.$location = $location;
    this.$http = $http;
    this.$q = $q;
    this.NotifyService = NotifyService;

    this.budget = ["3000-5000", "5000-10000", "10000-20000", "20000-50000", "50000-100000", "100000-200000", "Over 200000"];

    this.Auth = Auth;
    if (Auth.isLoggedIn()) {
      this.currentUser = Auth.getCurrentUserSync();
      this.loadUser(this.currentUser._id).then(result => {
        this.user = result;
        this.user.messages.forEach(function(message) {
          message.reply=false;
          if (message.status == "New")
            this.messageCount++;
        });
      this.totalMessages = this.user.messages.length;
      });
    }

    if (this.tableState) {
      this.tableState.pagination.numberOfPages = Math.ceil(this.totalMessages / this.tableState.pagination.number);
    }
  }

  loadUser(userID) {
    var deferredUser = this.$q.defer();
    var currUser = {};
    this.$http.get('/api/users/'+this.currentUser._id).then(response => {
        currUser = response.data;
        deferredUser.resolve(currUser);
      }).catch(function(data) {
        deferredUser.reject(data);
        console.log(data);
      });

      return deferredUser.promise;
  }

  updateProfile(form) {
    this.submitted = true;

    if (form.$valid) {
      this.$http.put('/api/users/' + this.currentUser._id, this.user).then(response => {
        if (response.status == 200) {
          this.NotifyService.setData("Saved", "User saved successfully");
          this.NotifyService.open("success");


        } else {
          this.NotifyService.setData("Not Saved", "Error saving user");
          this.NotifyService.open("warning");
        }
      });
    }
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }

  showLot(lotID) {
    this.LotService.setCurrLot(lotID);
    this.$location.path('/lot');

  }

  showMessage(row) {
    row.expanded = !row.expanded;

    if (row.expanded && (row.status == "New")) {
      // Update the status to Read and save in DB
      row.status = "Read";
      this.$http.put('/api/users/'+this.currentUser._id+'/message', row);
      this.messageCount--;
    }
  }

  replyMessage(row) {
    row.reply=true;
  }

  sendReply(row) {
    var that = this;
    // The seller_id in the lot is the user to send the message to
    var myMessage = {
      from_user_id: this.currentUser._id,
      username: this.currentUser.username,
      subject: row.subject,
      message: this.messageText,
      send_date: new Date(),
      status: 'New'
    };

    that.$http.post('/api/users/'+row.from_user_id+'/message', myMessage).then(response => {
      this.NotifyService.setData("Sent", "Message sent");
      this.NotifyService.open("success");
      row.reply = false;
    }).catch(err => {
      this.NotifyService.setData("Error", "There was a problem sending your message. Please try again.");
      this.NotifyService.open("error");
    });


  }

  deleteWatch(row) {
    this.$http.delete('/api/users/'+this.currentUser._id+'/watch/'+ row.lot_id).then(response => {
      if (response.status == 200) {
        this.$http.delete('/api/lots/' + row.lot_id + '/watch/'+ this.currentUser._id).then(response => {
          if (response.status == 200) {
            this.user.watching = this.user.watching.filter(function (el) {
              return el.lot_id != row.lot_id;
            });
          }
        });
      }
    });
  }

  deleteMessage(row) {
    if (row.status == "New")
      this.messageCount--;
    this.$http.delete('/api/users/'+this.currentUser._id+'/message/'+ row._id).then(response => {
      if (response.status == 200) {
        this.user.messages = this.user.messages.filter(function(el) {
          return el._id != row._id;
        });
      } else {
        this.NotifyService.setData("Sorry", "We are unable to delete this message.");
        this.NotifyService.open("error");
      }
    }).catch(err => {
      this.NotifyService.setData("Sorry", "We are unable to delete this message.");
        this.NotifyService.open("error");
    });
  }

  setBudget(budget) {
    this.user.budget = budget;
  }

  messageAdmin() {
    var that = this;
    // The seller_id in the lot is the user to send the message to
    var myMessage = {
      from_user_id: this.currentUser._id,
      username: this.currentUser.username,
      subject: "Message for admin",
      message: this.messageText,
      send_date: new Date(),
      status: 'New'
    };

    // get admin users
    var adminlist;
    this.$http.get('/api/users/admin').then(response => {
      adminlist = response.data;
      adminlist.forEach(function(admin) {
        that.$http.post('/api/users/'+admin._id+'/message', myMessage);
      });

      this.NotifyService.setData("Sent", "Message sent");
      this.NotifyService.open("success");
    }).catch(err => {
      this.NotifyService.setData("Error", "There was a problem sending your message. Please try again.");
      this.NotifyService.open("error");
    });;


  }
}
