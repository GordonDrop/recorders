angular
  .module('app')
  .component('audioRecord', {
    templateUrl: 'app/audio-record.html',
    controller: Controller,
    controllerAs: 'vm'
  });

function Controller() {
  this.audioOptions = {
    controls: true,
    width: 640,
    height: 480,
    plugins: {
      wavesurfer: {
        src: 'live',
        waveColor: 'green',
        progressColor: '#2E732D',
        debug: true,
        cursorWidth: 1,
        msDisplayMax: 20,
        hideScrollbar: true
      },
      record: {
        audio: true,
        video: false,
        maxLength: 20,
        debug: true
      }
    }
  };
}
