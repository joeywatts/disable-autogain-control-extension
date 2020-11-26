(function () {
    if (window.DISABLE_AUTOGAIN_INSTALLED) {
        return;
    }
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('disableAutogain.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).prepend(s);
    console.log("Installed <script> tag for disabling automatic gain control");
})();
var DISABLE_AUTOGAIN_INSTALLED = true;
