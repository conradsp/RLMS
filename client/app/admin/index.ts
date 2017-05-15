'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');

import routing from './admin.routes';
import dashboard from './dashboard/dashboard.component';
import adminlot from './adminlot/adminlot.component';
import adminlotlist from './adminlotlist/adminlotlist.component';
import adminother from './adminother/adminother.component';
import adminuser from './adminuser/adminuser.component';
import adminuserlist from './adminuserlist/adminuserlist.component';


export default angular.module('rlmsApp.admin', [

  uiRouter,
  uiBootstrap,
  dashboard,
  adminlot,
  adminlotlist,
  adminother,
  adminuser,
  adminuserlist
])
  .config(routing)

  .run(function($rootScope) {
    'ngInject';
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
