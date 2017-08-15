angular
  .module('app')
  .component('hcMicrophoneViewport', {
    template: '<div></div>',
    controller: Controller,
    controllerAs: 'vm',
    bindings: {
      src: '<'
    }
  });

function Controller($scope, $element) {
  var vm = this;
  // TODO: add timer
  this.$onInit = function () {
    this.initMicrophone();
    this.bindEvents();
  };

  this.bindEvents = function () {
    $scope.$on('paused', function () {
      vm.microphone.stop();
      vm.wavesurfer.stop();
    });

    $scope.$on('recording', function () {
      vm.microphone.start();
    });

    $scope.$on('replaying', function () {
      vm.wavesurfer.load(vm.src);
      vm.wavesurfer.on('ready', vm.wavesurfer.play.bind(vm.wavesurfer))
    });
  };

  this.initMicrophone = function () {
    var container = $element.find('div');
    this.wavesurfer = WaveSurfer.create({ container: container[0], waveColor: 'green' });
    this.microphone = Object.create(WaveSurfer.Microphone);

    this.microphone.init({
      wavesurfer: this.wavesurfer
    });
  };

  this.initReplay = function () {
    var container = $element.find('div');
    this.wavesurfer = WaveSurfer.create({ container: container[0], waveColor: 'green' });
    this.wavesurfer.load(this.src);
  };

  this.$onDestroy = function () {
    this.microphone && this.microphone.destroy();
    this.wavesurfer.destroy();
  };

  // this.$onChanges = function (changesObj) {
  //   if (changesObj.status.currentValue !== changesObj.status.previousValue) {
  //     this.microphone[this.status]();
  //   }
  // }
}
