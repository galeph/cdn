#!/bin/env node

const SESSION_NUMBER = 1;
const SESSION_TIME = 'day';
const CHECK_NUMBER = 1;
const CHECK_TIME  = 'week';

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
GLOBAL.packages = require('../package.json');
var connect  = require('../db').principal();

GLOBAL.async.parallel({
	sessions : function (callback) {
		connect.model('session').find({
			$or : [{
				expires : {
					$lt : moment().toDate()
				}	
			},{
				lastAccess : {
					$lt : moment().subtract(SESSION_NUMBER, SESSION_TIME).toDate()
				},
				'data.passport' : { $exists : false }
			}]
		}, function (err, doc) {
			if(err || !doc.length)
				return callback(err, 0);

			GLOBAL.async.map(doc, function (item, next) {
				item.remove(function (err) {
					next(err, !err);
				});
			}, function (err, num) {
				callback(err, _.compact(num).length);
			});
		});
	},
	feedback : function (callback) {
		connect.model('feed').find({
			favo : { $type : 10 },
			like : { $type : 10 },
			view : { $exists : false }
		}, function (err, doc) {
			if(err || !doc.length)
				return callback(err, 0);

			GLOBAL.async.map(doc, function (item, next) {
				item.remove(function (err) {
					next(err, !err);
				});
			}, function (err, num) {
				callback(err, _.compact(num).length);
			});
		});	
	},
	checking : function (callback) {
		connect.model('checkin').find({
			dateCr : {
				$lt : moment().subtract(CHECK_NUMBER, CHECK_TIME).toDate()
			},
			status : 0
		}).populate('baucher').exec(function (err, doc) {
			if(err || doc.length)
				return callback(err, []);
			GLOBAL.async.map(doc, function (item, next) {
				GLOBAL.async.map(item.baucher, function (baucher, next) {
					baucher.remove(function (err) {
						next(err, !err);
					});
				}, function (err) {
					if(err)
						return next(err);
					item.remove(function (err) {
						next(err, !err);
					});
				});				
			}, function (err, num) {
				callback(err, _.compact(num).length);
			});

		});
	}
}, function (err, data) {
	if(err) console.error(err);
	for (var i in data)
		console.log(i + ':', data[i]);

	process.exit();
});
