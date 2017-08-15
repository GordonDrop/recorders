module.exports = {
  extends: [
    'angular'
  ],
  rules: {
    'angular/no-service-method': 0
  },
  globals: {
    'videojs': true,
    'lodash': true,
    '_': true,
    'RecordRTC': true,
    'RecordRTCPromisesHandler': true
  }
};
