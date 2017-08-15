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
  vm.src = '';
  vm.status = 'paused';
  vm.recorder = HcRecorderService.audioRecorder();

  // TODO: this common recorder interface
  // TODO: add resume action
  vm.recorder
    .then(function (recorder) {
      vm.recorder = recorder;
    })
    .catch(function (error) {
      vm.error = error
    });

  this.startRecording = function () {
    vm.src = '';
    vm.recorder.startRecording();
    vm.status = 'recording';
    $scope.$broadcast('recording');

    $log.log(this.recorder);
  };

  this.replay = function () {
    $scope.$broadcast('replaying');
    vm.status = 'replaying';
  };

  this.stop = function () {
    vm.status = 'paused';
    $scope.$broadcast('paused');
  };

  this.stopRecording = function () {
    this.stop();

    this.recorder.stopRecording()
      .then(function (url) {
        vm.src = $sce.trustAsResourceUrl(url);
        $scope.$digest();
      });
  };
  
  this.saveRecording = function () {
    var blob = this.recorder.getBlob();
    this.save(blob);
  };
}
