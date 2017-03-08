// console.log(document.cookie, chrome);

function dispose_cookie(key) {
  var date = new Date();
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  var domain = '.' + location.hostname.split('.').slice(-2).join('.'); // top domain
  document.cookie = key + '=; domain=' + domain + '; path=/; expires=' + date.toGMTString();
}

function set_cookie(key, value) {
  var domain = '.' + location.hostname.split('.').slice(-2).join('.'); // top domain
  if (typeof value === 'string') {
    value = encodeURIComponent(value);
  }
  document.cookie = key + '=' + value + '; domain=' + domain + '; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

function get_cookie(sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

var handlers = {
  'mode-change': function(message) {
    if (!message.enabled) {
      dispose_cookie('__mock_enabled');
    } else {
      set_cookie('__mock_enabled', '1');
      set_cookie('__mock_server', message.server);
      set_cookie('__mock_clientid', message.clientid);
    }
    send_icon_message(message.enabled);

    location.reload();
  },

  'test-activate': function(message) {
    send_icon_message(get_cookie('__mock_enabled') === '1');
  },

  'query-status': function (message, sender, sendResponse) {
      sendResponse({
          enabled: get_cookie('__mock_enabled'),
          clientid: get_cookie('__mock_clientid'),
          server: get_cookie('__mock_server')
      });
  }
};


function send_icon_message(active) {
  chrome.extension.sendMessage({
    event: 'set-icon',
    active: active
  });
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var event = message.event;

  var handler = handlers[event];

  handler && handler(message, sender, sendResponse);
});

