'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');

import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';


export default angular.module('rlmsApp.account', [

    uiRouter,
    uiBootstrap,
    login,
    settings,
    signup
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
