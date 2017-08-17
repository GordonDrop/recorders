angular
  .module('app')
  .directive('recorder', recorder);

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

var MP3_DEAFAULTS = {
  plugins: {
    record: {
      audioEngine: 'lamejs',
      audioWorkerURL: '../../bower_components/lamejs/worker-example/worker-realtime.js'
    }
  }
};

var WEBM_DEAFULTS = {
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

var RECORDER_DEFAULTS = LIBVORBIS_DEFAULTS;

function recorder(FileManagerService) {
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

        $scope.options = _.merge($scope.options, DEFAULTS);

        $scope.options.plugins.record.audioEngine = RECORDER_DEFAULTS.plugins.record.audioEngine;
        $scope.options.plugins.record.audioWorkerURL = RECORDER_DEFAULTS.plugins.record.audioWorkerURL;

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

        $scope.player.on('deviceError', function() {
          console.log('Device error:', $scope.player.deviceErrorCode);
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
        FileManagerService.invokeSaveAsDialog($scope.player.recordedData, 'recorderAudio');
      };
    }
  }
}
