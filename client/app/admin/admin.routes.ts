'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      template: require('./dashboard/dashboard.pug'),
      controller: 'DashboardComponent',
      controllerAs: 'admin',
      authenticate: 'admin'
    })
    .state('adminlot', {
      url: '/adminlot',
      template: require('./adminlot/adminlot.pug'),
      controller: 'AdminlotComponent',
      controllerAs: 'adminlot'
      authenticate: 'admin'
    })
    .state('adminlotlist', {
      url: '/adminlotlist',
      template: require('./adminlotlist/adminlotlist.pug'),
      controller: 'AdminlotlistComponent',
      controllerAs: 'lotlist',
      authenticate: 'admin'
    })
    .state('other', {
      url: '/adminother',
      template: require('./adminother/adminother.pug'),
      controller: 'AdminotherComponent',
      controllerAs: 'admin',
      authenticate: 'admin'
    })
    .state('adminuser', {
      url: '/adminuser/:userID',
      template: require('./adminuser/adminuser.pug'),
      controller: 'AdminuserComponent',
      controllerAs: 'adminuser'
      authenticate: 'admin'
    })
    .state('adminuserlist', {
      url: '/adminuserlist',
      template: require('./adminuserlist/adminuserlist.pug'),
      controller: 'AdminuserlistComponent',
      controllerAs: 'userlist'
      authenticate: 'admin'
    });
};
