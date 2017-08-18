;(function () {
  angular
    .module('app')
    .directive('videoRecorder', recorder);

// MOVE to service
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

//  Use video/mp4 (Firefox) or video/webm;codecs=H264 (Chrome 52 and newer) for MP4.

  function recorder(FileManagerService, BrowserService) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/video-recorder/video-recorder.template.html',

      link: function ($scope, $element) {

        function init() {
          $scope.readyToSave = false;

          if (!$scope.options) {
            $scope.options = _.merge(DEFAULTS, $scope.options);
            $scope.options.plugins.record.videoMimeType = BrowserService.isChrome() ?
              'video/webm;codecs=H264' :
              'video/mp4'
          }

          var videoNode = createVideoNode();
          $element[0].querySelector('.video').appendChild(videoNode);
          $scope.player = videojs(videoNode.id, $scope.options);

          bindEvents();
        }
        init();

        function createVideoNode() {
          var node = document.createElement('video');
          node.id = 'player_' + $scope.$id;
          node.className = 'video-js vjs-default-skin';

          return node;
        }
        function reInit() {
          $scope.player.stopDevice();
          $scope.player.dispose();
          init();
        }

        function bindEvents() {
          $scope.player.on('startRecord', function () {
            $scope.readyToSave = false;
            $scope.$digest();
          });

          $scope.player.on('finishRecord', function () {
            $scope.readyToSave = true;
            $scope.$digest();
          });

          $scope.player.on('deviceError', function() {
            console.log('Device error:', $scope.player.deviceErrorCode);
          });

          $scope.$on('$destroy', function () {
            $scope.player.recorder.stopDevice();
            $scope.player.dispose();
          });
        }

        $scope.setEngine = reInit;

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
