'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('category', {
      url: '/category',
      template: '<category></category>'
    });
}
