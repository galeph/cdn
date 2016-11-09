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
GLOBAL.packages = require('../package.json');
var max = require('../routes/maker/max');
var con = require('../db');

function out (err) {
	if(err) console.log(err);
	process.exit();
}

con.principal()
	.model('user')
	.aggregate([
	{
		$match : {
			'connect.notic.mail' : {
				$gte : moment().subtract(2, 'hours').toDate()
			}
		}
	},
	{
		$unwind : '$connect.emails'
	},
	{
		$group: {
			_id : '$connect.emails.mail',
		}
	}
]).exec(function (err, emails) {
	if(err)
		return out(err);
	async.map(emails, function (item, next) {
		max.remove(item._id, next);
	}, out);
});