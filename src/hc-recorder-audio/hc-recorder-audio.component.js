angular
  .module('app')
  .component('hcRecorderAudio', {
    templateUrl: 'hc-recorder-audio/hc-recorder-audio.template.html',
    controller: Controller,
    controllerAs: 'vm',
    bindings: {
      save: '<'
    }
  });

function Controller($scope, HcRecorderService, $sce, $log) {
  var vm = this;
  vm.audioUrl = '';
  vm.status = 'stop';
  vm.recorder = HcRecorderService.audioRecorder();

  // TODO: this common recorder interface
  // TODO: add resume action
  vm.recorder
    .then(function (recorder) {
      vm.recorder = recorder;
      console.log(vm.recorder);
    })
    .catch(function (error) {
      vm.error = error
    });

  this.startRecording = function () {
    vm.recorder.startRecording();
    vm.status = 'start';

    $log.log(this.recorder);
  };

  this.stopRecording = function () {
    vm.status = 'stop';

    this.recorder.stopRecording()
      .then(function (url) {
        vm.src = $sce.trustAsResourceUrl(url);
        $scope.$digest();
      })
  };
  
  this.saveRecording = function () {
    var blob = this.recorder.getBlob();
    this.save(blob);
  }
}
