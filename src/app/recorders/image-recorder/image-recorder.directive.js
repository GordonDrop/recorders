;(function () {
  angular
    .module('app')
    .directive('imageRecorder', recorder);

  var DEFAULTS = {
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

  function recorder(FileManagerService) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/recorders/image-recorder/image-recorder.template.html',

      link: function ($scope, $element) {
        function init() {
          $scope.readyToSave = false;

          if (!$scope.options) {
            $scope.options = _.merge(DEFAULTS, $scope.options);
          }

          var audioNode = createVideoNode();
          $element[0].querySelector('.viewport').appendChild(audioNode);
          $scope.player = videojs(audioNode.id, $scope.options);
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
            blob: FileManagerService.dataURItoBlob($scope.player.recordedData),
            url: $scope.player.recordedData
          };

          $scope.onSave(fileObject);
        };

        $scope.download = function () {
          var blob = FileManagerService.dataURItoBlob($scope.player.recordedData);
          FileManagerService.invokeSaveAsDialog(blob, 'image');
        };
      }
    }
  }
})();
