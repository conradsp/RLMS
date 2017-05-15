'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('lot', {
      url: '/lot',
      template: '<lot></lot>'
    });
}
