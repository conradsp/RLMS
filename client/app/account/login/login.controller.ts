'use strict';
// @flow
interface User {
  username: string;
  email: string;
  password: string;
}

export default class LoginController {
  user: User = {
    username: '',
    email: '',
    password: ''
  };
  errors = {login: undefined};
  submitted = false;
  Auth;
  $state;
  $rootScope;

  /*@ngInject*/
  constructor(Auth, $state, $rootScope) {
    this.Auth = Auth;
    this.$state = $state;
    this.$rootScope = $rootScope;
  }

  login(form) {
    var that=this;
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        username: this.user.username,
        password: this.user.password
      }).then(() => {
        this.$rootScope.$emit('updateNavbar', { isAdmin: that.Auth.hasRoleSync('admin'), isAgent: that.Auth.hasRoleSync('agent')} )
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        this.errors.login = err.message;
      });
    }
  }
}
