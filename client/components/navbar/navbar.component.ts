'use strict';
/* eslint no-sync: 0 */
const angular = require('angular');

export class NavbarComponent {

  menu = [];

  usermenu = [{
    'title': 'View Lots',
    'state': 'category'
  },
    {
      'title': 'About RLMS',
      'state': 'about'
    },
    {
      'title': 'Conditions',
      'state': 'conditions'
    },
    {
      'title': 'Contact',
      'state': 'contact'
    },
    {
      'title': 'Calendar',
      'state': 'calendar'
    }
  ];

  adminmenu = [{
    'title': 'Dashboard',
    'state': 'dashboard'
  },
    {
      'title': 'Lots',
      'state': 'adminlotlist'
    },
    {
      'title': 'Users',
      'state': 'adminuserlist'
    },
    {
      'title': 'Other Admin',
      'state': 'other'
    }
  ];

  agentmenu = [
    {
      'title': 'Lots',
      'state': 'adminlotlist'
    }
  ];

  isLoggedIn: Function;
  isAdmin: Function;
  getCurrentUser: Function;
  isCollapsed = true;

  constructor(Auth, $rootScope) {
    var that=this;
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

    if (Auth.hasRoleSync('admin')) {
        that.menu = that.adminmenu;
    } else if (Auth.hasRoleSync('agent')) {
        that.menu = that.agentmenu;
    } else {
        that.menu = that.usermenu;
    }

    $rootScope.$on('updateNavbar', function(event, args) {
      if (args.isAdmin) {
        that.menu = that.adminmenu;
      } else if (args.isAgent) {
        that.menu = that.agentmenu;
      }
      else {
        that.menu = that.usermenu;
      }
    });
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
