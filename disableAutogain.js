(function() {
    var original = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = function getUserMedia(constraints) {
        if (constraints && constraints.audio
            && typeof constraints.audio === 'object') {
            if (constraints.audio.autoGainControl) {
                constraints.audio.autoGainControl = false;
            }
            for (const opt of constraints.audio.optional || []) {
                if (opt.googAutoGainControl) {
                    opt.googAutoGainControl = false;
                }
            }
        }
        console.log("Automatically unsetting gain!", constraints);
        return original.call(this, constraints);
    };
    console.log(
        "Disable Autogain by Joey Watts!",
        navigator.mediaDevices.getUserMedia
    );
})();