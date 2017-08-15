angular
  .module('app')
  .component('hcMicrophoneViewport', {
    template: '<div class="data-waveform"></div>',
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
    $scope.$on('stopped', function () {
      vm.microphone.stop();
    });

    $scope.$on('paused', function () {
      vm.wavesurfer.pause();
    });

    $scope.$on('recording', function () {
      vm.microphone.start();
    });

    $scope.$on('playing', function () {
      vm.wavesurfer.play();
    });

    this.wavesurfer.on('finish', function () {
      vm.wavesurfer.stop();
      $scope.$emit('audioPause')
    });

    this.wavesurfer.on('audioprocess', function () {
      // console.log(vm.wavesurfer.getCurrentTime());
      // console.log(vm.wavesurfer.getDuration());
    });
  };

  this.initMicrophone = function () {
    var container = $element[0].querySelector('.data-waveform');
    this.wavesurfer = WaveSurfer.create({ container: container, waveColor: 'green' });
    this.microphone = Object.create(WaveSurfer.Microphone);

    this.microphone.init({
      wavesurfer: this.wavesurfer
    });
  };

  this.$onDestroy = function () {
    this.microphone && this.microphone.destroy();
    this.wavesurfer.destroy();
  };

  this.$onChanges = function (changesObj) {
    if (changesObj.src.currentValue) {
      vm.wavesurfer.load(vm.src);
    }
  };
}
