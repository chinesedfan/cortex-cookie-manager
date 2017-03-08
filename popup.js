// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {event: 'query-status'}, function (res) {
            document.getElementById('mockenabled').checked = res.enabled;
            document.getElementById('mockclientid').value = res.clientid || '';
            document.getElementById('mockserver').value = decodeURIComponent(res.server) || '';
        });
        document.addEventListener('change',function(){
            var data = {
                event: 'mode-change',
                enabled: document.getElementById('mockenabled').checked,
                clientid: document.getElementById('mockclientid').value,
                server: document.getElementById('mockserver').value
            };

            chrome.tabs.sendMessage(tabs[0].id, data);
        });
    });
});
