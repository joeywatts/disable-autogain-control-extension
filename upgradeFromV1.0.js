function enableMeetHangouts() {
    chrome.runtime.sendMessage({
        type: "enable-meet-hangouts"
    }, granted => {
        if (granted) {
            this.textContent = "Enabled Google Meet and Hangouts";
            this.disabled = true;
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("enable-meet-hangouts-button")
        .addEventListener("click", enableMeetHangouts);
});
