'use strict'

export class HTTP {
    /**
     * The get request method
     * 
     * @param {string} url An url to request
     * @param {function} handler A callback function to process the request response
     * @param {object} opts An object of requests parameters
     *      @param {object} headers An oject of HTTP headers
     *      @param {string|object} body  A data to send
     * 
     * @return {void}
     */
    static get(url, handler, opts = {}) {
        HTTP.request('GET', url, opts, handler);
    }

     /**
     * The get request method
     * 
     * @param {string} url An url to requesting
     * @param {function} handler A callback function to process the request response
     * @param {object} opts An object of requests parameters
     *      @param {object} headers An oject of HTTP headers
     *      @param {string|object} body  A data to send
     * 
     * @return {void}
     */
    static post(url, handler, opts = {}) {
        HTTP.request('POST', url, opts, handler);
    }

    /**
     * The AJAX request sender
     * 
     * @param {string} method An HTTP method 
     * @param {string} url An url to request
     * @param {object} opts An object of requests parameters
     *      @param {object} headers An oject of HTTP headers
     *      @param {string|object} body  A data to send
     * @param {function} handler A callback function to process the request response
     * 
     * @return {void}
     */
    static request(method, url, opts, handler) {
        let xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = null;
                let err = null;

                if (xhr.status === 200) {
                    res = xhr.responseText;

                    try { res = JSON.parse(res); }
                    catch {}
                } else {
                    err = `Server responded with an ${xhr.status} status code.`;
                }

                handler(err, res);
            }
        }

        if (opts.headers) {
            for (let header in opts.headers) {
                xhr.setRequestHeader(header, opts.headers[header]);
            }
        }

        if (opts.body) {
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send(null);
        }
    }
}