angular
  .module('app')
  .component('videoRecord', {
    templateUrl: 'app/video-record.html',
    controller: Controller,
    controllerAs: 'vm'
  });

function Controller(browserService) {
  var vm = this;

  vm.videoOptions = {
    controls: true,
    width: 320,
    height: 240,
    controlBar: {
      volumeMenuButton: false
    },
    plugins: {
      record: {
        audio: true,
        video: true,
        maxLength: 5,
        videoMimeType: browserService.isChrome() ? 'video/webm;codecs=H264' : 'video/mp4'
      }
    }
  };

  vm.mediaList = [];

  vm.onSave = function (fileObject) {
    console.log(fileObject);
    vm.mediaList.push(fileObject);
  }
}
