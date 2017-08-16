angular
  .module('app')
  .directive('recorder', recorder);

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
      maxLength: 20,
      debug: true
    }
  }
};

function recorder() {
  return {
    restrict: 'E',
    scope: {
      options: '=',
      onSave: '='
    },
    templateUrl: 'app/audio-recorder/audio-recorder.template.html',

    link: function ($scope, $element) {
      function init() {
        $scope.readyToSave = false;
        var playerNode = $element[0].querySelector('.video-js');
        playerNode.id = 'player_' + $scope.$id;

        $scope.options = angular.extend(DEFAULTS, $scope.options);
        $scope.player = videojs(playerNode.id, $scope.options);
      }
      init();

      function bindEvents() {
        $scope.player.on('startRecord', function () {
          $scope.readyToSave = false;
          $scope.$digest();
        });

        $scope.player.on('finishRecord', function () {
          $scope.readyToSave = true;
          $scope.$digest();
        });
      }
      bindEvents();

      $scope.$on('$destroy', function () {
        $scope.player.dispose();
      });

      $scope.save = function () {
        var fileObject = {
          blob: $scope.player.recordedData,
          url: $scope.player.recorder.mediaURL
        };

        $scope.onSave(fileObject);
      };

      $scope.download = function () {
        $scope.player.recorder.saveAs({'audio': 'recorderAudio'});
      };
    }
  }
}
