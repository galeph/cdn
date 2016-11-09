#!/bin/env node

function closer(e){
	if(e) console.error(e);
	fs.writeFile(URI_PACK, JSON.stringify(mail, null, '\t'), function (err) {
		if(err) console.error(err);
		console.log('[%s] Is Send %s', moment().toDate(), num );
		process.exit();
	});
}

GLOBAL.fs	= require('fs');
GLOBAL.path	= require('path');
GLOBAL.async= require('async');
GLOBAL.moment= require('moment');
process.env.DATA_DIR = path.join(__dirname, 'package.json');

const querystring = require('querystring');
const request = require('request');
const nodemailer = require('nodemailer');
const maz = require('mailchimp-api');
const events = require(path.join(__dirname, '..', 'event.js'));

var packages = require(process.env.DATA_DIR);
var num = 0;
if(!packages.mail.campaing) 
	return closer();

_		= require('underscore');
_.str	= require('underscore.string');
_.mixin(GLOBAL._.str.exports());

var chimp = new maz.Mailchimp(packages.mail.chimp);
var VASRZ = {
	'*|ABOUT_LIST|*': 'https://about.galeph.com/',
	'*|ARCHIVE|*': 'https://galeph.com?external=mailing',
	'*|EMAIL|*': false,
	'*|FORWARD|*': 'help@galeph.com',
	'*|LIST:ADDRESSLINE|*': '',
	'*|MC:SUBJECT|*': '',
	'*|REWARDS|*' : '',
	'*|UNSUB|*': 'mailto:unsuscribe@user.galeph.com?subject=Unsuscribe&body=Send this email',
	'*|UPDATE_PROFILE|*': 'http://galeph.com/settings',
	'*|URL:ARCHIVE_LINK_SHORT|*': 'https://galeph.com?external=mailing',
	'*|URL:MC_SUBJECT|*': 'Galeph '
};

var DATA;
/*var transporter = nodemailer.createTransport(require('nodemailer-smtp-pool')({
	port : GLOBAL.packages.env.smtp.port,
	host : GLOBAL.packages.env.smtp.host,
	secure : true,
	auth : {
		user: GLOBAL.packages.env.smtp.user,
		pass: GLOBAL.packages.env.smtp.pass
	},
	ignoreTLS : false,
	authMethod : 'PLAIN',
	tls : { rejectUnauthorized: true },
	maxMessages: packages.mail.query.limit + 1,
	maxConnections : packages.mail.query.limit / 10000,
}));*/
var transporter = nodemailer.createTransport(require('nodemailer-sendmail-transport')());
var sen = new events(1);
transporter.use('compile', require('nodemailer-html-to-text').htmlToText());

async.waterfall([
	function (callback) {
		chimp.campaigns.list({
			options  : {
				view : "raw"
			}
		}, function (data) {
			var campaing = _.find(data.data, function (item) {
				return item.id === packages.mail.campaing;
			});

			if(!campaing)
				return callback(new Error('No existe the campaing'));

			packages.mail.subject = campaing.subject;

			VASRZ['*|MC:SUBJECT|*'] = packages.mail.subject;
			VASRZ['*|URL:MC_SUBJECT|*'] = packages.mail.subject;

			VASRZ['*|ARCHIVE|*'] = campaing.archive_url;
			VASRZ['*|URL:ARCHIVE_LINK_SHORT|*' ]= campaing.archive_url;

			callback();
		}, callback);
	},
	function (callback) {
		chimp.campaigns.content({
			cid : packages.mail.campaing,
			options : {
				view : "raw"
			}
		}, function (data) {
			DATA = data;
			callback();
		}, callback);
	},
	function (callback) {
		var query = _.clone(packages.mail.query);
		query.limit = 1;
		--query.offset;

		request.get(packages.mail.URS + querystring.stringify(packages.mail.query), function (err, res, body) {
			try{
				var json = JSON.parse(body);
				if(json.err)
					return callback(json.err);
				packages.mail.sender = _.strLeftBack(json.doc[0].mail, '@' ) + '@user.galeph.com';
				callback();
			}catch(e){
				callback(e);
			}
		});
	},
	function (callback) {
		request.get(packages.mail.URS + querystring.stringify(packages.mail.query), function (err, res, body) {
			try{
				var json = JSON.parse(body);
				callback(json.err, json.doc);
			}catch(e){
				callback(e);
			}
		});
	},
	function  (data, callback) {
		for (var i in VASRZ){
			if(VASRZ[i]) DATA.html = DATA.html.replace(i, VASRZ[i]);
		}

		sen.on('done', callback);
		sen.on('data', function (e, next) {
			var ml = _.clone(DATA);
			ml.from = packages.mail.sender;
			ml.to = e.mail;
			ml.subject = packages.mail.subject;
			ml.html = ml.html.replace('*|EMAIL|*', e.mail).replace(/\*\|([A-Z\:\_]{1,})\|\*/gim, '' ).replace(/\t|\n/gim,'');
			packages.mail.query.offset++;
			transporter.sendMail(ml, next);
		});
		sen.init(data);
	}
], closer);