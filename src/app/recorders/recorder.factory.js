;(function () {
  angular
    .module('app')
    .factory('RecorderFactory', RecorderFactory);

  function RecorderFactory() {
    return {
      mix: mix
    };

    function mix($scope, $element, type) {
      $scope.readyToSave = false;
      $scope.type = type;

      $scope.viewportStrategies = {
        'audio': createAudioNode,
        'video': createVideoNode,
        'image': createVideoNode
      };

      function createVideoNode() {
        var node = document.createElement('video');
        node.id = 'player_' + $scope.$id;
        node.className = 'video-js vjs-default-skin';

        return node;
      }

      function createAudioNode() {
        var node = new Audio();
        node.id = 'player_' + $scope.$id;
        node.className = 'video-js vjs-default-skin';

        return node;
      }

      $scope.setup = function () {
        $scope.options = _.merge($scope.DEFAULTS, $scope.options);
      };

      $scope.init = function () {
        $scope.setup();

        var viewportNode = $scope.viewportStrategies[$scope.type]();
        $element[0]
          .querySelector('.viewport')
          .appendChild(viewportNode);

        $scope.player = videojs(viewportNode.id, $scope.options);
        $scope.bindEvents();
      };

      $scope.reInit = function () {
        $scope.player.recorder.stopDevice();
        $scope.player.dispose();
        $scope.init();
      };

      $scope.bindEvents = function () {
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
      };
    }
  }
})();
