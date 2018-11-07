var tddjs = tddjs || {};

(function(global) {
    global.ajax = {};
    var ajax = global.ajax;

    /**
     * Define ajax.create()
     */
    var i, l;
    var xhr;
    var options = [
        function() {
            return new ActiveXObject('Microsoft.XMLHTTP');
        },
        function() {
            return new XMLHttpRequest();
        }
    ];

    for (i = 0, l = options.length; i < l; i++) {
        try {
            xhr = options[i]();

            if (typeof xhr.readyState === 'number' &&
               typeof xhr.open === 'function' &&
               typeof xhr.send === 'function' &&
               typeof xhr.setRequestHeader === 'function') {
                ajax.create = options[i];
                break;
            }
        } catch (x) {}
    }

    /**
     * Utilities
     */
    global.isLocal = (function() {
        function isLocal() {
            return !!(window.location &&
                     window.location.protocol.indexOf('file:') === 0);
        }
    }());
    
    function requestComplete(transport, options) {
        var status = transport.status;
        if (200 <= status && status < 300 ||
            status === 304 ||
            (global.isLocal() && !status)) {
            if (typeof options.success === 'function') {
                options.success(transport);                
            }
        } else {
            if (typeof options.failure === 'function') {
                options.failure(transport);                
            }
        }
    }

    global.urlParams = (function() {
        if (typeof encodeURIComponent === 'undefined') {
            return;
        }

        return function (object) {
            if (!object) {
                return '';
            }

            if (typeof object === 'string') {
                return encodeURI(object);
            }

            var pieces = [];

            for (i in object) {
                if (object.hasOwnProperty(i)) {
                    pieces.push(encodeURIComponent(i) + '=' +
                                encodeURIComponent(object[i]));
                }
            }

            return pieces.join('&');
        }
    }());

    /**
     * Define ajax.request()
     */
    ajax.request = function(url, options) {
        if (typeof url !== 'string') {
            throw new TypeError('URL should be string');
        }

        var opts = options || {};
        for (i in options) {
            if (options.hasOwnProperty(i)) {
                opts[i] = options[i];
            }
        }
        if (opts.data) {
            opts.data = global.urlParams(opts.data);

            if (opts.method === 'GET') {
                url += '?' + opts.data;
                opts.data = null;
            }
        } else {
            opts.data = null;
        }
        var transport = ajax.create();

        transport.open(opts.method || 'GET', url, true);
        transport.onreadystatechange = function() {
            if (transport.readyState === 4) {
                requestComplete(transport, opts);
                transport.onreadystatechange = function() {};
            }
        };
        transport.send(opts.data);
    }
    
    /**
     * Define ajax.get()
     */    
    ajax.get = function(url, options) {
        var opts = {};
        var i;

        for (i in options) {
            if (options.hasOwnProperty(i)) {
                opts[i] = options[i];
            }
        }

        opts.method = 'GET';
        ajax.request(url, opts);
    }

    /**
     * Define ajax.post()
     */    
    ajax.post = function(url, options) {
        var opts = {};
        var i;

        for (i in options) {
            if (options.hasOwnProperty(i)) {
                opts[i] = options[i];
            }
        }

        opts.method = 'POST';
        ajax.request(url, opts);
    }
})(tddjs);