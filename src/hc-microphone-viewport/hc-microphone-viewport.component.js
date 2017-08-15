angular
  .module('app')
  .component('hcMicrophoneViewport', {
    template: '<div></div>',
    controller: Controller,
    controllerAs: 'vm',
    bindings: {
      status: '<'
    }
  });

function Controller($element) {
  // TODO: add timer
  this.$onInit = function () {
    var container = $element.find('div');
    this.wavesurfer = WaveSurfer.create({ container: container[0], waveColor: 'green' });
    this.microphone = Object.create(WaveSurfer.Microphone);

    this.microphone.init({
      wavesurfer: this.wavesurfer
    });

    this.microphone.on('audioprocess', function () {
      console.log(arguments);
    })
  };

  this.$onDestroy = function () {
    this.microphone.destroy();
    this.wavesurfer.destroy();
  };

  this.$onChanges = function (changesObj) {
    if (changesObj.status.currentValue !== changesObj.status.previousValue) {
      this.microphone[this.status]();
    }
  }
}
