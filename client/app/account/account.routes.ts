'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
      .state('login', {
        url: '/login',
        template: require('./login/login.pug'),
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth, $rootScope) {
          'ngInject';
          $rootScope.$emit('updateNavbar', { isAdmin: false, isAgent: false } );
          var referrer = $state.params.referrer
                        || $state.current.referrer
                        || 'main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        template: require('./signup/signup.pug'),
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        template: require('./settings/settings.pug'),
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });
}

