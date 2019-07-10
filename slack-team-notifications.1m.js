#!/usr/bin/env /usr/local/bin/node
/* jshint esversion: 8 */
/* jshint asi: true */


// <bitbar.title>Slack Team Notifications</bitbar.title>
// <bitbar.version>v1.0.0</bitbar.version>
// <bitbar.author>Benji Encalada Mora</bitbar.author>
// <bitbar.author.github>benjifs</bitbar.author.github>
// <bitbar.image>https://i.imgur.com/x1SoIto.jpg</bitbar.image>
// <bitbar.desc>Show notifications for Slack teams and channels with option to mark as read.</bitbar.desc>
// <bitbar.dependencies>node.js superagent</bitbar.dependencies>

const request = require('superagent');
const tokens = require('./.tokens.js');

// Set DARK_MODE = true to force white icon
const DARK_MODE = process.env.BitBarDarkMode;

const DEBUG = process.argv.indexOf('--debug') > 0;
const SCRIPT = process.argv[1];

// Slack API
const SLACK_API = 'https://slack.com/api/';
const SLACK_CHANNELS = 'channels';
const SLACK_GROUPS = 'groups';
const SLACK_CONVERSATIONS = 'conversations';
const SLACK_IM = 'im';
const SLACK_TEAM = 'team';
const SLACK_USERS = 'users';
const SLACK_USER_CONVERSATIONS = 'users.conversations';
const SLACK_INFO = '.info';
const SLACK_MARK = '.mark';

// ICONS {
// Dark Slack Icon
const SLACK_ICON_B = 'image=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';

// White Slack Icon
const SLACK_ICON_W = 'image=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'
// }

let unread_count = 0;
const slack_output = {};
const errors = [];

debug('Debugging');

if (process.argv.indexOf('--mark') > 0) {
	console.log('Mark as read');

	let token;
	for (let i = 3; i < process.argv.length; i++) {
		if (process.argv[i].indexOf('--token=') === 0) {
			token = process.argv[i].split('=')[1];
		}
	}
	if (!token) {
		console.log('Error: Missing token');
		return;
	}

	for (let i = 3; i < process.argv.length; i++) {
		let args = process.argv[i].split('=');
		if (args.length != 2) {
			continue;
		}
		if ([SLACK_CHANNELS, SLACK_GROUPS, SLACK_IM].indexOf(args[0]) < 0) {
			continue;
		}

		let channels = args[1].split(',');
		for (let j in channels) {
			console.log('/' + args[0] + SLACK_MARK + ' (' + channels[j] + ')');
			slack_request(args[0] + SLACK_MARK, {
				'token': token,
				'channel': channels[j],
				'ts': Math.floor(Date.now() / 1000)
			})
				.then((body) => {
					// console.log('  Success: ' + args[0] + ':' + channels[j]);
				});
		}
	}
	return;
}

function debug(message) {
	return DEBUG && console.log(message);
}

function slack_request(URL, query) {
	debug('  /' + URL + (query.channel ? ' (' + query.channel + ')' : ''));
	return request
		.get(SLACK_API + URL)
		.query(query)
		.then((res) => {
			if (res && res.body && res.body.ok === true) {
				return Promise.resolve(res.body);
			}
			return Promise.reject(res.body.error);
		})
		.catch((err) => {
			debug('ERROR: ' + err);
			debug('  ' + URL);
			debug('  ' + JSON.stringify(query));
			errors.push(URL + ': ' + err + ' | color=red');
		});
}

function output() {
	unread_count = unread_count > 10 ? '10+' : unread_count > 0 ? unread_count : '';
	if (errors.length > 0) {
		console.log('! |color=red ' + (DARK_MODE ? SLACK_ICON_W : SLACK_ICON_B));
	} else {
		console.log(unread_count + ' | ' + (DARK_MODE ? SLACK_ICON_W : SLACK_ICON_B));
	}

	if (Object.keys(slack_output).length) {
		for (let i in slack_output) {
			let team = slack_output[i];

			// Only show team name if there are notifications for this team
			if (team.notifications.length > 0) {
				console.log('---');
				console.log(team.name + ' | size=12');

				for (let j in team.notifications) {
					console.log(team.notifications[j]);
				}
				console.log('Mark all as read ' +
					'|bash=' + SCRIPT +
					' param1=--mark' +
					' param2=--token=' + team.token +
					(team.params[SLACK_IM] ? ' param3=' + SLACK_IM + '=' + team.params[SLACK_IM].join() : '') +
					(team.params[SLACK_GROUPS] ? ' param4=' + SLACK_GROUPS + '=' + team.params[SLACK_GROUPS].join() : '') +
					(team.params[SLACK_CHANNELS] ? ' param5=' + SLACK_CHANNELS + '=' + team.params[SLACK_CHANNELS].join() : '') +
					' refresh=true' +
					' terminal=false');
			}
		}
	}
	if (errors.length > 0) {
		console.log('---');
		console.log('Errors');
		for (let i in errors) {
			console.log('--' + errors[i]);
		}
	}
}

function channel_output(channel) {
	unread_count += channel.count;

	let output_str = (channel.is_im ? '@' : '#') + channel.name;
	if (output_str.length > 15) {
		output_str = output_str.substring(0, 14) + '…';
	}
	output_str += ' '.repeat(17 - output_str.length);
	output_str += (channel.count > 10 ? '10+' : channel.count);

	let key = channel.is_im ? SLACK_IM : channel.is_channel ? SLACK_CHANNELS : SLACK_GROUPS;
	let href = 'slack://channel?team=' + channel.team + '&id=' + channel.id;

	slack_output[channel.token].notifications.push(output_str + '|font=Menlo size=13 href=' + href);
	slack_output[channel.token].notifications.push('Mark as read ' +
		'|alternate=true' +
		' font=Menlo size=13' +
		' bash=' + SCRIPT +
		' param1=--mark' +
		' param2=--token=' + channel.token +
		' param3=' + key + '=' + channel.id +
		' refresh=true' +
		' terminal=false');

	if (!slack_output[channel.token].params[key]) {
		slack_output[channel.token].params[key] = [];
	}
	slack_output[channel.token].params[key].push(channel.id);
}

async function run() {
	if (typeof tokens === 'undefined' || !tokens || !tokens.length) {
		errors.push('Missing Slack Legacy Token | color=red href=https://api.slack.com/custom-integrations/legacy-tokens');
		return output();
	}

	for (let i in tokens) {
		await get_team_notifications(tokens[i]);
	}
	output();
}

function get_team_notifications(token) {
	return get_team_info(token)
		.then((team) => {
			if (team) {
				slack_output[token] = {
					'id': team.id,
					'name': team.name,
					'token': token,
					'notifications': [],
					'params': {},
					'errors': []
				};
				return get_team_channels(token);
			}
		})
		.then((channels) => {
			return get_channels_info(channels, token);
		})
		.then((channels) => {
			return check_channels_unread(channels, token);
		})
		.then((channels) => {
			for (let i in channels) {
				if (channels[i]) {
					channel_output(channels[i]);
				}
			}
		});
}

function get_team_info(token) {
	debug('Fetching team info for ' + token);
	return slack_request(SLACK_TEAM + SLACK_INFO, {
		'token': token
	})
		.then((body) => {
			if (body && body.team) {
				return Promise.resolve(body.team);
			}
		});
}

function get_team_channels(token) {
	debug('Fetching channels for ' + token);
	return slack_request(SLACK_USER_CONVERSATIONS, {
		'token': token,
		'exclude_archived': true,
		'limit': 200,
		'types': 'public_channel,private_channel,mpim,im'
	})
		.then((body) => {
			if (body && body.channels) {
				return Promise.resolve(body.channels);
			}
		});
}

function get_user(user, token) {
	debug('Fetch user info for ' + user);
	return slack_request(SLACK_USERS + SLACK_INFO, {
		'token': token,
		'user': user
	})
		.then((body) => {
			if (body && body.user) {
				return Promise.resolve(body.user);
			}
		});
}

async function get_channels_info(channels, token) {
	let req = [];
	for (let i in channels) {
		let channel = channels[i];

		if (channel.is_im && channel.is_user_deleted) {
			continue;
		} else if (channel.is_group && !channel.is_open) {
			continue;
		}

		req.push(get_channel_info(channel, token));
	}
	return await Promise.all(req);
}

function get_channel_info(channel, token) {
	let url;
	if (channel.is_channel) {
		url = SLACK_CHANNELS;
		debug('Fetch channel info for #' + channel.name + ' (' + channel.id + ')');
	} else if (channel.is_group) {
		url = SLACK_GROUPS;
		debug('Fetch group info for #' + channel.name + ' (' + channel.id + ')');
	} else {
		url = SLACK_CONVERSATIONS;
		debug('Fetch conversation info for ' + channel.id);
	}
	return slack_request(url + SLACK_INFO, {
		'token': token,
		'channel': channel.id,
		'unreads': true
	})
		.then((body) => {
			if (body) {
				if (body.group) {
					body.channel = body.group;
				}
				if (body.channel) {
					body.channel.shared_team_ids = channel.shared_team_ids;
					return Promise.resolve(body.channel);
				}
			}
		});
}

async function check_channels_unread(channels, token) {
	let req = [];
	for (let i in channels) {
		if (channels[i]) {
			req.push(is_channel_unread(channels[i], token));
		}
	}
	return await Promise.all(req);
}

function is_channel_unread(channel, token) {
	// unread_count_display is a count of messages that the calling user has
	// yet to read that matter to them (this means it excludes things like
	// join/leave messages)
	if (channel && channel.unread_count_display > 0) {
		if (channel.is_im) {
			return get_user(channel.user, token)
				.then((user) => {
					if (user) {
						return Promise.resolve({
							'id': channel.id,
							'name': user.name,
							'count': channel.unread_count_display,
							'team': user.team_id,
							'is_im': true,
							'token': token
						});
					}
				});
		} else if (channel.is_member || channel.is_group) {
			let team = channel.shared_team_ids && channel.shared_team_ids.length > 0 ? channel.shared_team_ids[0] : '';
			return Promise.resolve({
				'id': channel.id,
				'name': channel.name,
				'count': channel.unread_count_display,
				'team': team,
				'is_channel': channel.is_member,
				'is_group': channel.is_group,
				'token': token
			});
		}
	}
}

run();

