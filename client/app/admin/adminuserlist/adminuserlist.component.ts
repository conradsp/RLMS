'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

export class AdminuserlistComponent {
  $location;
  $http;
  $state;
  NotifyService;
  users = [];
  displayedUsers = [];
  searchCriteria = null;
  userCount = 0;
  tableState = null;
  isLoading = false;

  constructor($http, socket, $location, $state, NotifyService) {
    this.$location = $location;
    this.$http = $http;
    this.$state = $state;
    this.NotifyService = NotifyService;
    this.getUsers();

  }

  getUsers()
  {

    this.$http.get('/api/users').then(response => {
      this.users = response.data;
      this.userCount = response.data.length;

      var number = 20;
      if (this.userCount < number)
        number = this.userCount;

      this.isLoading = false;
      this.displayedUsers = [];
      for (var i=0; i<number; i++)
        this.displayedUsers.push(this.users[i]);

      if (this.tableState) {
        this.tableState.pagination.numberOfPages = Math.ceil(this.userCount / this.tableState.pagination.number);
      }
    });
  }

  setStatus(user, status) {
    var payload = { status: null };
    payload.status = status;
    this.$http.put('/api/users/status/'+user._id, payload).then(response => {
      if (response.status == 200) {
        user.status = status;
        this.NotifyService.setData("Saved", "User updated successfully");
        this.NotifyService.open("success");
      }
    });
  }

  removeUser(user) {
    this.$http.delete('/api/users/'+user._id).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Saved", "User removed");
        this.NotifyService.open("success");
        this.getUsers();
      }
    });
  }

  clearSearch()
  {
    this.searchCriteria = null;
    this.getUsers();
  }

  userSearch()
  {
    var params = {
      search : this.searchCriteria
    };

    this.$http.put('/api/users', params).then(response => {
      this.userCount = response.data.length;
      this.users = response.data;

      var number = this.tableState.pagination.number;
      if (this.userCount < number)
        number = this.userCount;

      this.isLoading = false;
      this.displayedUsers = [];
      for (var i=0; i<number; i++)
        this.displayedUsers.push(this.users[this.tableState.pagination.start+i]);

      this.tableState.pagination.numberOfPages = Math.ceil(this.userCount/this.tableState.pagination.number);//set the number of pages so the pagination ca
    });
  }

  showUser(userID) {
    this.$location.path('adminuser/'+userID);

  }

  addUser() {
    this.$state.params.status = 'new';
    this.$state.go('adminuser');

  }
}

export default angular.module('rlmsApp.adminuserlist', [uiRouter])
  .controller('AdminuserlistComponent', AdminuserlistComponent)
  .name;
