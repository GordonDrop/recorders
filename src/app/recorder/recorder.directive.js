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
      options: '='
    },
    templateUrl: 'app/recorder/recorder.template.html',

    link: function ($scope, $element) {
      var playerNode = $element[0].querySelector('.video-js');
      playerNode.id = 'player_' + $scope.$id;

      $scope.options = angular.extend(DEFAULTS, $scope.options);
      var player = videojs(playerNode.id, $scope.options);

      scope.$on('$destroy', function () {
        player.dispose();
      });
    }
  }
}
