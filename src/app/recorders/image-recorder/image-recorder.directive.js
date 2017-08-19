;(function () {
  angular
    .module('app')
    .directive('imageRecorder', imageRecorder);

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

  function imageRecorder(
    FileManagerService,
    RecorderFactory
  ) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        onSave: '='
      },
      templateUrl: 'app/recorders/image-recorder/image-recorder.template.html',

      link: function ($scope, $element) {
        RecorderFactory.mix($scope, $element, 'image');
        $scope.DEFAULTS = DEFAULTS;

        $scope.init();
        $scope.setEngine = $scope.reInit;

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
