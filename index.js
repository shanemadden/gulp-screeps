/*
 * gulp-screeps
 * https://github.com/pcmulder/gulp-screeps
 *
 * Copyright (c) 2015 Patrick Mulder
 * Licensed under the MIT license.
 */

'use strict';

var through = require('through2'),
    PluginError = require('plugin-error'),
    log = require('fancy-log'),
    http = require('http'),
    https = require('https'),
    util = require('util'),
    path = require('path'),
    fs = require('fs');

var PLUGIN_NAME = 'gulp-screeps';

module.exports = function (opt) {
    opt = opt || {};

    var files = [];
    var modules = {};

    if (typeof opt.host !== 'string'){
        opt.host = 'screeps.com';
    }
    
    if (typeof opt.port !== 'number'){
        opt.port = 443;
    }

    if (typeof opt.secure !== 'boolean'){
        opt.secure = opt.port === 443;
    }

    if ((typeof opt.email !== 'string' || typeof opt.password !== 'string') && typeof opt.token !== 'string') {
        throw new PluginError(PLUGIN_NAME, 'Please provide account information');
    }

    if (typeof opt.branch !== 'string'){
        opt.branch = 'default';
    }

    function bufferContents(file, enc, cb) {
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            cb();
            return;
        }
        files.push(file);

        cb();
    }

    function endStream(cb) {

        files.map(function (file) {
            var name = path.basename(file.path).replace(/\.js$/,'');
            modules[name] = file.contents.toString('utf-8');
        });

        var request = (opt.secure ? https : http).request;
        var reqOpts = {
            hostname: opt.host,
            port: opt.port,
            path: opt.ptr ? '/ptr/api/user/code' : '/api/user/code',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        
        if(opt.email && opt.password) {
            reqOpts.auth = opt.email + ':' + opt.password;
        }
        if(opt.token) {
            reqOpts.headers['x-token'] = opt.token;
        }

        var req = request(reqOpts,
            function (res) {
                res.setEncoding('utf8');

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function () {
                    data = JSON.parse(data);
                    if (data.ok) {
                        var msg = 'Committed to Screeps account';
                        if (opt.email) {
                            msg += ' "' + opt.email + '"';
                        }
                        if (opt.token) {
                            msg += ' with token';
                        }
                        if (opt.branch) {
                            msg += ' branch "' + opt.branch + '"';
                        }
                        if (opt.host !== "screeps.com") {
                            msg += ' on server "' + opt.host + '"';
                        }
                        msg += '.';
                        log(msg);
                        cb();
                    }
                    else {
                        log('Error while committing to Screeps: ' + util.inspect(data));
                        cb('Error while committing to Screeps: ' + util.inspect(data));
                    }
                });

                res.on('error', cb);
            });

        var data = {
            branch: opt.branch,
            modules: modules
        };

        req.write(JSON.stringify(data));
        req.end();
    }

    return through.obj(bufferContents, endStream);
};
