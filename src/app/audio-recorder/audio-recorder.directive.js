;(function () {
  angular
    .module('app')
    .directive('audioRecorder', recorder);

// MOVE to service
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

  var MP3_DEFAULTS = {
    plugins: {
      record: {
        audioEngine: 'lamejs',
        audioWorkerURL: '../../bower_components/lamejs/worker-example/worker-realtime.js'
      }
    }
  };

  var WEBM_DEFAULTS = {
    plugins: {
      record: {
        audioEngine: 'recordrtc',
        audioWorkerURL: ''
      }
    }
  };

// Javascript ogg vorbis encoder.
  var LIBVORBIS_DEFAULTS = {
    plugins: {
      record: {
        audioEngine: 'libvorbis.js',
        audioWorkerURL: ''
      }
    }
  };

  var WAV_DEFAULTS = {
    plugins: {
      record: {
        audioEngine: 'recorder.js',
        audioWorkerURL: ''
      }
    }
  };

  var TYPE_VALUES = ['webm', 'ogg', 'wav', 'mp3'];

  var TYPE_MAP = {
    'mp3': MP3_DEFAULTS,
    'webm': WEBM_DEFAULTS,
    'ogg': LIBVORBIS_DEFAULTS,
    'wav': WAV_DEFAULTS
  };

  function recorder(FileManagerService) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/audio-recorder/audio-recorder.template.html',

      link: function ($scope, $element) {
        $scope.engines = TYPE_VALUES;
        $scope.currentEngine = TYPE_VALUES[0];

        function init() {
          $scope.readyToSave = false;

          if (!$scope.options) {
            $scope.options = _.merge(DEFAULTS, $scope.options);
          }

          $scope.options = _.merge($scope.options, TYPE_MAP[$scope.currentEngine]);

          var audioNode = createAudioNode();
          $element[0].querySelector('.video').appendChild(audioNode);
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
