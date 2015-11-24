/**
 * A simple impleation of Promise/A
 *
 * @author victor li
 * @date 2015/11/24
 */

var queue = [];

// promise's all possible status
var STATUS = ['unfulfilled', 'fulfilled', 'failed'];

var Promise = function() {
    this.status = STATUS[0];
    this.response = undefined;
    this.error = undefined;
    this.resolveListener = undefined;
    this.rejectListener = undefined;
};

Promise.prototype.then = function(resolveHandler, rejectHandler) {
    this.resolveListener = resolveHandler;
    this.rejectListener = rejectHandler;
    queue.push(this);
    return this;
};

Promise.prototype.resolve = function(value) {
    this.status = STATUS[1];
    this.response = value;
    var currentPromise = this;
    queue.forEach(function(item, index) {
        if (currentPromise === item) {
            item.resolveListener(item.response);
            delete queue[index];
        }
    });
};

Promise.prototype.reject = function(error) {
    this.status = STATUS[2];
    this.error = error;
    var currentPromise = this;
    queue.forEach(function(item, index) {
        if (currentPromise === item) {
            item.rejectListener(item.error);
        }
    });
};

var ajax = function(method, path, async) {
    var promise = new Promise();
    var xhr = new XMLHttpRequest();
    xhr.open(method, path, async);

    xhr.onload = function(res) {
        promise.resolve(xhr.response);
    };

    xhr.onerror = function(err) {
        promise.reject(err);
    };

    xhr.send();

    return promise;

};


ajax('get', 'http://demo.com', true).then(function(res) {
    console.log(res);
}, function(err) {
    console.log(err);
});


