#!/bin/env node

GLOBAL.os		= require('os');
GLOBAL.fs		= require('fs');
GLOBAL.url		= require('url');
GLOBAL.sys		= require('sys');
GLOBAL.util		= require('util');
GLOBAL.path		= require('path');
GLOBAL.async	= require('async');
GLOBAL.express	= require('express');
GLOBAL._		= require('underscore');
GLOBAL._.str	= require('underscore.string');
GLOBAL.moment   = require('moment');
GLOBAL._.mixin(GLOBAL._.str.exports());

GLOBAL.async.series({
	variables (callback) {
		GLOBAL.packages = require('./package.json');
		process.env.OPENSHIFT_APP_NAME = process.env.OPENSHIFT_APP_NAME || 'BLUE';
		process.env.OPENSHIFT_APP_UUID = process.env.OPENSHIFT_APP_UUID || 'BLAS';

		process.env.OPENSHIFT_DATA_DIR = process.env.OPENSHIFT_DATA_DIR || path.join(__dirname);
		process.env.OPENSHIFT_TMP_DIR = process.env.OPENSHIFT_TMP_DIR || path.join(process.env.OPENSHIFT_DATA_DIR, 'tmp');
		process.env.DATA_DIR = path.join(process.env.OPENSHIFT_DATA_DIR, 'content');

		process.env.OPENSHIFT_NODEJS_IP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
		process.env.OPENSHIFT_NODEJS_PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

		process.env.OPENSHIFT_POSTGRESQL_DB_HOST = process.env.OPENSHIFT_POSTGRESQL_DB_HOST || '127.0.0.1';
		process.env.OPENSHIFT_POSTGRESQL_DB_PORT = process.env.OPENSHIFT_POSTGRESQL_DB_PORT || 27017;

		process.env.NODE_ENV = process.env.NODE_ENV || GLOBAL.packages.env.node;

		console.log('Check variables');
		require( path.join(__dirname, 'routes', 'cdn', 'routes' ) ).change(true)(null, null, callback);
	},
	deletes (callback) {
		console.log('Clean static files');
		fs.readdir(process.env.OPENSHIFT_TMP_DIR, function (err, dir) {
			if(err)
				return callback(err);
			async.map(dir, (item, next) => {
				if(!/\.(css|js)/gi.test(item))
					return next();
				fs.unlink(path.join(process.env.OPENSHIFT_TMP_DIR, item), next);
			}, callback);
		});
	},
	create (callback) {
		console.log('Create a static files');
		var compiler = require( path.join(__dirname, 'routes', 'cdn', 'routes' ) );
		async.parallel({
			js (cal) {
				async.map([
					'cdn',
					'glph',
					'www',
					'www-land',
					'cdn-ie',
					'import',
					'shop',
					'search'
				], (item, next) => {
					compiler.JS({
						method : 'GET',
						params : {
							file : item
						},
						start : true
					}, null, data => {
						next(util.isError(data) ? data : null, util.isError(data) ? null : data );
					});
				},cal);
			},
			css (cal) {
				async.map([
					'all',
					'glph',
					'glph-ie'
				], (item, next) => {
					compiler.CSS({
						method : 'GET',
						params : {
							file : item
						},
						start : true
					}, null, data => {
						next(util.isError(data) ? data : null, util.isError(data) ? null : data );
					});
				},cal);
			}
		}, callback);
	},

	server (callback) {
		console.log('Check Server');
		var server;
		try{
			server = require('./routes');
			callback(null, server);
		}catch(e){
			callback(e, server);
		}
	}
}, (err, results) => {
	if(err || _.isEmpty(results.server)) 
		throw err || new Error('The server no exist');
});
