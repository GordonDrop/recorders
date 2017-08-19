;(function () {
  angular
    .module('app')
    .directive('videoRecorder', videoRecorder);

  var DEFAULTS = {
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
        debug: true
      }
    }
  };

  function videoRecorder(
    FileManagerService,
    BrowserService,
    RecorderFactory
  ) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/recorders/video-recorder/video-recorder.template.html',

      link: function ($scope, $element) {
        RecorderFactory.mix($scope, $element, 'video');
        $scope.DEFAULTS = DEFAULTS;

        $scope.setup = function () {
          $scope.options = _.merge($scope.DEFAULTS, $scope.options);
          $scope.options.plugins.record.videoMimeType = BrowserService.isChrome() ?
            'video/webm;codecs=H264' :
            'video/mp4'
        };

        $scope.init();
        $scope.setEngine = $scope.reInit;

        $scope.save = function () {
          var fileObject = {
            blob: $scope.player.recordedData.video,
            url: $scope.player.recorder.mediaURL
          };

          $scope.onSave(fileObject);
        };

        $scope.download = function () {
          FileManagerService.invokeSaveAsDialog($scope.player.recordedData.video, 'recorderVideo');
        };
      }
    }
  }
})();
