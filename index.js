/*
 * gulp-screeps
 * https://github.com/pcmulder/gulp-screeps
 *
 * Copyright (c) 2015 Patrick Mulder
 * Licensed under the MIT license.
 */

'use strict';

var through = require('through2'),
    gutil = require('gulp-util'),
    https = require('https'),
    util = require('util'),
    path = require('path'),
    fs = require("fs");

var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-screeps';

module.exports = function (opt) {
    opt = opt || {};

    var files = [];
    var modules = {};

    if (typeof opt.email !== 'string' || typeof opt.password !== 'string') {
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

        var req = https.request({
                hostname: 'screeps.com',
                port: 443,
                path: opt.ptr ? '/ptr/api/user/code' : '/api/user/code',
                method: 'POST',
                auth: opt.email + ':' + opt.password,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            },
            function (res) {
                res.setEncoding('utf8');

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function () {
                    data = JSON.parse(data);
                    if (data.ok) {
                        var msg = 'Committed to Screeps account "' + opt.email + '"';
                        if (opt.branch) {
                            msg += ' branch "' + opt.branch + '"';
                        }
                        msg += '.';
                        gutil.log(msg);
                    }
                    else {
                        gutil.log('Error while committing to Screeps: ' + util.inspect(data));
                    }
                });
            });

        var data = {
            branch: opt.branch,
            modules: modules
        };

        req.write(JSON.stringify(data));
        req.end();

        cb();
    }

    return through.obj(bufferContents, endStream);
};
