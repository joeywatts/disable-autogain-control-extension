// Show context menu that allows enabling/disabling on a per-domain basis.
chrome.browserAction.onClicked.addListener(tab => {
    const { origin } = new URL(tab.url);
    chrome.permissions.contains({
        origins: [origin + "/*"],
    }, (hasPermission) => {
        if (hasPermission) {
            chrome.permissions.remove({
                origins: [origin + "/*"]
            }, () => chrome.tabs.reload(tab.id));
        } else {
            chrome.permissions.request({
                origins: [origin + "/*"]
            }, () => chrome.tabs.reload(tab.id));
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    injectScriptIfNecessary(tab);
});

/**
 * @param {chrome.tabs.Tab} tab 
 */
function injectScriptIfNecessary(tab) {
    if (tab.status !== "loading" || !tab.url) {
        return;
    }

    try {
        const { origin } = new URL(tab.url);
        chrome.permissions.contains({
            origins: [origin + "/*"]
        }, (hasPermission) => {
            if (hasPermission) {
                chrome.tabs.executeScript(tab.id, {
                    runAt: "document_start",
                    allFrames: true,
                    file: "installDisableAutogain.js",
                });
            }
            chrome.browserAction.setTitle({
                title: hasPermission
                    ? "Disable Automatic Gain Control"
                    : "Enable Automatic Gain Control",
                tabId: tab.id,
            });
            chrome.browserAction.setBadgeText({
                text: hasPermission ? "On" : "",
                tabId: tab.id,
            });
        });
    } catch (e) {
        console.error("Failed to inject script", e);
    }
}

function showUsage() {
    chrome.tabs.create({
        url: chrome.extension.getURL("usage.html")
    });
}

function showUpgradeNotice() {
    chrome.tabs.create({
        url: chrome.extension.getURL("upgradeFromV1.0.html")
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === "object" && message["type"] === "enable-meet-hangouts") {
        chrome.permissions.request({
            origins: [
                "https://meet.google.com/*",
                "https://hangouts.google.com/*"
            ]
        }, (granted) => {
            sendResponse(granted);
        });
        return true;
    }
});

chrome.contextMenus.create({
    title: "Usage",
    contexts: ["browser_action"],
    onclick: () => {
        showUsage();
    }
});

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
    if (reason === "update" && previousVersion === "1.0") {
        showUpgradeNotice();
    } else if (reason === "install") {
        showUsage();
    }
});
