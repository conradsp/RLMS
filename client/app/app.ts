'use strict';
const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');
const ngSmartTable = require('angular-smart-table');
const ngFileUpload = require('ng-file-upload');
import './js/ng-img-crop.js';
import './js/ng-img-crop.css';
import 'angular-socket-io';
import 'angular-confirm';

const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
// const ngMessages = require('angular-messages');
// import ngValidationMatch from 'angular-validation-match';


import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import LotService from '../components/LotService/LotService.service';
import NotifyService from '../components/NotifyService/NotifyService.service';

import lot from './lot/lot.component';
import category from './category/category.component';


import './app.scss';

angular.module('rlmsApp', [
  ngCookies,
  ngResource,
  ngSanitize,

  'btford.socket-io',

  uiRouter,
  uiBootstrap,

  ngSmartTable,
  ngFileUpload,
  'ngImgCrop',
  'angular-confirm',

  _Auth,
  account,
  admin,
  navbar,
  footer,
  main,
  constants,
  socket,
  util,
  lot,
  category,
  LotService,
  NotifyService
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['rlmsApp'], {
      strictDi: true
    });
  });
