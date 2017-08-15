angular
  .module('app')
  .component('app', {
    templateUrl: 'app/app.template.html',
    controllerAs: 'vm',
    controller: Controller
  });

function Controller() {
  var vm = this;

  this.$onInit = function () {
    vm.audioBlobs = [];
    vm.videoBlobs = [];
  };

  this.saveAudio = function (fileBlob) {
    vm.audioBlobs.push(fileBlob);
    console.log('saved');
    console.log(fileBlob);
  };

  this.saveVideo = function (fileBlob) {
    vm.videoBlobs.push(fileBlob);
    console.log('saved');
    console.log(fileBlob);
  };
}
