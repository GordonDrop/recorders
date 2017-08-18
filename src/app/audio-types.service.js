;(function () {
  angular
    .module('app')
    .factory('AudioTypesService', AudioTypesService);

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

  var TYPE_MAP = {
    'webm': WEBM_DEFAULTS,
    'mp3': MP3_DEFAULTS,
    'ogg': LIBVORBIS_DEFAULTS,
    'wav': WAV_DEFAULTS
  };

  var MIME_TYPES = {
    'webm': ['audio/webm'],
    'mp3': ['audio/mpeg'],
    'ogg': ['audio/ogg'],
    'wav': ['audio/x-wav', 'audio/wav']
  };

  function AudioTypesService(BrowserService) {
    return {
      getSupportedTypes: getSupportedTypes,
      getSupportedTypesNames: getSupportedTypesNames
    };

    function getSupportedTypesNames() {
      return _.keys(getSupportedTypes());
    }

    function getSupportedTypes() {
      var results = {};
      _.each(TYPE_MAP, function (type, key) {
        var supported = MIME_TYPES[key].map(function (type) {
          return BrowserService.isMediaTypeSupported(type);
        });

        if (supported.length) {
          results[key] = TYPE_MAP[key];
        }
      });

      return results;
    }
  }
})();