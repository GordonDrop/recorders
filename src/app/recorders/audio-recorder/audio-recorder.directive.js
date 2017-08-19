;(function () {
  angular
    .module('app')
    .directive('audioRecorder', audioRecorder);

  var DEFAULTS = {
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
        maxLength: 30,
        debug: true,
        audioEngine: 'recordrtc',
        audioWorkerURL: ''
      }
    }
  };

  function audioRecorder(
    FileManagerService,
    AudioTypesService,
    RecorderFactory
  ) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/recorders/audio-recorder/audio-recorder.template.html',

      link: function ($scope, $element) {
        RecorderFactory.mix($scope, $element, 'audio');

        $scope.engines = AudioTypesService.getSupportedTypesNames();
        $scope.currentEngine = $scope.engines[0];
        $scope.typesMap = AudioTypesService.getSupportedTypes();
        $scope.DEFAULTS = DEFAULTS;

        $scope.init();

        $scope.setEngine = function () {
          $scope.options = _.merge($scope.options, $scope.typesMap[$scope.currentEngine]);
          $scope.reInit();
        };

        $scope.save = function () {
          var fileObject = {
            blob: $scope.player.recordedData,
            url: $scope.player.recorder.mediaURL
          };

          $scope.onSave(fileObject);
        };

        $scope.download = function () {
          FileManagerService.invokeSaveAsDialog($scope.player.recordedData, 'recorderAudio');
        };
      }
    }
  }
})();
