'use strict';

var ajax = function(uri, cb) {
    if (!cb) { cb = function() {}; }
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', uri, true);
    var cbInner = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            return cb(null, JSON.parse(xhr.response));
        }
        cb('error requesting ' + uri);
    };
    xhr.onload  = cbInner;
    xhr.onerror = cbInner;
    xhr.send(null);
};



var ajaxSync = function(uri) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('GET', uri, false);
    xhr.send(null);
    return (xhr.status === 200)  ? xhr.responseText : undefined;
};
