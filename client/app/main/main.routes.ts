'use strict';


export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>'
    })
    .state('about', {
      url: '/about',
      template: require('./about.pug')
    })
    .state('conditions', {
      url: '/conditions',
      template: require('./conditions.pug')
    })
    .state('contact', {
      url: '/contact',
      template: require('./contact.pug')
    })
    .state('calendar', {
      url: '/calendar',
      template: require('./calendar.pug')
    });;
};
