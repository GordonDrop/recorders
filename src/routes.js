angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: '/',
      component: 'app'
    })
    .state('app.audio', {
      url: 'audio-record',
      component: 'audioRecord'
    })
    .state('app.video', {
      url: 'video-record',
      component: 'videoRecord'
    });
}
