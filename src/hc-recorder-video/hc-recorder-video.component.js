angular
  .module('app')
  .component('hcRecorderVideo', {
    templateUrl: 'hc-recorder-video/hc-recorder-video.template.html',
    controller: Controller,
    controllerAs: 'vm',
    bindings: {
      save: '<'
    }
  });

function Controller($scope, HcRecorderService, $sce, $log) {
  var vm = this;
  this.$onInit = function () {
    vm.audioUrl = '';
    vm.status = 'pause';
    vm.recorder = HcRecorderService.videoRecorder();

    // TODO: this common recorder interface
    vm.recorder
      .then(this.initRecorder)
      .catch(function (error) {
        vm.error = error
      });
  };

  this.initRecorder = function (recorder) {
    vm.recorder = recorder;
  };

  this.startRecording = function () {
    vm.recorder.startRecording();

    // var url = URL.createObjectURL(vm.recorder.blob);
    // vm.src = $sce.trustAsResourceUrl(url);
    vm.status = 'play';

    $log.log(this.recorder);
  };

  this.stopRecording = function () {
    vm.status = 'pause';

    this.recorder.stopRecording()
      .then(function () {
        var url = URL.createObjectURL(vm.recorder.blob);
        vm.src = $sce.trustAsResourceUrl(url);
        $scope.$digest();
      })
  };
  
  this.saveRecording = function () {
    var blob = this.recorder.getBlob();
    this.save(blob);
  }
}
