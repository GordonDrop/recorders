# Media recorders

Set of angular directives wrapper for [videojs-recorder](https://github.com/collab-project/videojs-record).

# Directives:

 - `<audio-recorder options="options" on-save="onSave">`
 - `<video-recorder options="options" on-save="onSave">`
 - `<image-recorder options="options" on-save="onSave">`
 
 # Options:
 All directive shares same options. 
 
 - options - Object, videojs config;
 - on-save - Function, callback for onSave action, argument: fileObject { blob, url }
