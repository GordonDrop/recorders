angular
  .module('app')
  .factory('HcRecorderService', HcRecorderService);

function HcRecorderService($window, $q) {
  // TODO: use as factory
  return {
    audioRecorder: audioRecorder,
    videoRecorder: videoRecorder,
    _getUserMedia: _getUserMedia
  };

  function audioRecorder() {
    var mediaConstraints = {video: false, audio: true};
    var options = {type: 'audio'};

    return _getUserMedia(mediaConstraints)
      .then(function (mediaStream) {
        return new RecordRTCPromisesHandler(mediaStream, options);
      });
  }

  function videoRecorder() {
    var mediaConstraints = {video: true, audio: true};
    var options = {type: 'video', frameInterval: 20};

    return _getUserMedia(mediaConstraints)
      .then(function (mediaStream) {
        return new RecordRTCPromisesHandler(mediaStream, options);
      });
  }

  function _getUserMedia(constraints) {
    return $q.when($window.navigator.mediaDevices.getUserMedia(constraints));
  }
}
