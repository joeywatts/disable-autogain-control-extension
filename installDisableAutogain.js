(function () {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('disableAutogain.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).prepend(s);
    console.log("Installed <script> tag for disabling automatic gain control");
})();