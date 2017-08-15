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

  this.$onInit = function () {
    this.initRecorder()
      .then(this.bindEvents.bind(this))
      .catch(function (error) {
        vm.error = error
      });
  };

  this.initRecorder = function () {
    return vm.recorder
      .then(function (recorder) {
        vm.recorder = recorder;
      });
  };

  this.bindEvents = function () {
    $scope.$on('audioPause', function () {
      vm.pause();
      $scope.$digest();
    });
  };

  this.startRecording = function () {
    vm.src = '';
    vm.recorder.startRecording();
    vm.status = 'recording';
    $scope.$broadcast('recording');

    $log.log(this.recorder);
  };

  this.play = function () {
    $scope.$broadcast('playing');
    vm.status = 'playing';
  };

  this.pause = function () {
    $scope.$broadcast('paused');
    vm.status = 'paused';
  };

  this.stopRecording = function () {
    vm.status = 'paused';
    $scope.$broadcast('stopped');

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
