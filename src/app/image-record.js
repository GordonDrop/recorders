angular
  .module('app')
  .component('imageRecord', {
    templateUrl: 'app/image-record.html',
    controller: Controller,
    controllerAs: 'vm'
  });

function Controller() {
  var vm = this;

  vm.imageOptions = {
    controls: true,
    width: 320,
    height: 240,
    controlBar: {
      volumeMenuButton: false,
      fullscreenToggle: false
    },
    plugins: {
      record: {
        image: true,
        debug: true
      }
    }
  };

  vm.mediaList = [];

  vm.onSave = function (fileObject) {
    debugger
    vm.mediaList.push(fileObject);
  }
}
