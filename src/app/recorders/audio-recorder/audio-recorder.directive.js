;(function () {
  angular
    .module('app')
    .directive('audioRecorder', recorder);

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

  function recorder(FileManagerService, AudioTypesService) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/recorders/audio-recorder/audio-recorder.template.html',

      link: function ($scope, $element) {
        $scope.engines = AudioTypesService.getSupportedTypesNames();
        $scope.currentEngine = $scope.engines[0];
        $scope.typesMap = AudioTypesService.getSupportedTypes();

        function init() {
          $scope.readyToSave = false;

          if (!$scope.options) {
            $scope.options = _.merge(DEFAULTS, $scope.options);
          }

          $scope.options = _.merge($scope.options, $scope.typesMap[$scope.currentEngine]);

          var audioNode = createAudioNode();
          $element[0].querySelector('.viewport').appendChild(audioNode);
          $scope.player = videojs(audioNode.id, $scope.options);
          bindEvents();
        }
        init();

        function createAudioNode() {
          var node = new Audio();
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
