angular
  .module('app')
  .component('hcVideoViewport', {
    template: '<video width="640" height="480" controls ng-src="{{vm.src}}"></video>',
    controller: Controller,
    controllerAs: 'vm',
    bindings: {
      status: '<'
    }
  });

function Controller($element, HcRecorderService, $sce) {
  // TODO: add timer
  var vm = this;

  this.$onInit = function () {
    vm.video = $element.find('video')[0];

    HcRecorderService._getUserMedia({video: true, audio: true})
      .then(function (mediaStream) {
        vm.src = $sce.trustAsResourceUrl(URL.createObjectURL(mediaStream));
      })
  };

  this.$onDestroy = function () {
  };

  this.$onChanges = function (changesObj) {
  };

  this.play = function () {

  }
}
