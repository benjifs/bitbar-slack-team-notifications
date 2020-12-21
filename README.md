# Slack Team Notifications
[Bitbar](https://github.com/matryer/bitbar) plugin to show the notification count from multiple [Slack](https://slack.com) teams and channels. You can also mark channels or whole teams as read.

**The original repo can be found here:** https://github.com/benjifs/bitbar-slack-team-notifications

![Slack Team Notifications screenshot](https://i.imgur.com/ORbsRBx.jpg)

## Install
1. Download and install [Bitbar](https://github.com/matryer/bitbar). You can also install it with [Homebrew](https://brew.sh/) by running `brew cask install bitbar`

2. Clone this repo to a directory of your choice. You will symlink the executable file afterwards to your bitbar plugins folder

3. Inside the cloned directory, run `npm install`

4. Navigate to your bitbar plugins folder and symlink `slack-team-notifications.1m.js`

```
ln -s {CLONED_REPO_DIRECTORY}/slack-team-notifications.1m.js slack-team-notifications.1m.js
```

## Configure

The following configuration options are available in the [slack-team-notifications.1m.js](slack-team-notifications.1m.js) file:
|OPTION|DESCRIPTION|DEFAULT VALUE|
|---|---|---|
|`BITBAR_SLACK_ICON`|Defines which Slack icon is used|If System Dark Mode is enabled the default value is `1`, otherwise it is `2`|
|`MENTIONS_ONLY`|Count only @mentions and DMs|false|
|`MAX_LENGTH`|Maximum length of channel name to display|18|
|`SHOW_ZERO_NOTIFICATIONS`|Shows "No new notifications" if `true` or omit the channel if `false`|true|

## Tokens

You will need to get your [Slack Legacy Tokens](https://api.slack.com/custom-integrations/legacy-tokens) for every team you want to get notifications from. After getting the legacy tokens, add them to the `.tokens.js` file:

> **NOTE:** [Slack Legacy Tokens were deprecated on May 5th, 2020](https://api.slack.com/changelog/2020-02-legacy-test-token-creation-to-retire). You can still use old legacy tokens but new ones cannot be created anymore.

```
module.exports = [
	'xoxp-123456',
	'xoxp-abcdef'
];
```

If you cannot use Slack Legacy Tokens, you can generate a token by using [OAuth](https://api.slack.com/docs/oauth). In order to use OAuth to generate a token it is **recommended** you create your own [Slack app](https://api.slack.com). There is a sample app created to show what the process would be like but ideally, you would create your own app. The app will need to have the following permissions:

|Permission|Reason|
|---|---|
|`channels:history`|Check channel for unread messages|
|`channels:read`|Get channel info|
|`channels:write`|Mark channel as read|
|`groups:history`|Check groups for unread messages|
|`groups:read`|Get group info|
|`groups:write`|Mark group as read|
|`im:history`|Check IM for unread messages|
|`im:read`|Get IM info|
|`im:write`|Mark IM as read|
|`mpim:history`|Check mpim for unread messages|
|`mpim:read`|Get mpim info|
|`mpim:write`|Mark mpim as read|
|`users:read`|If unread IM, get username for user|
|`team:read`|Get team name|

The app should also have a valid redirect URL that will received `code` as a GET parameter and then makes a call to Slack's [oauth.access](https://api.slack.com/methods/oauth.access) method to get the final token. You can see a basic sample of how this is handled in the [index.html](https://github.com/benjifs/bitbar-slack-team-notifications/blob/master/index.html) for this plugin.

## Issues
For any issues or suggestions:
https://github.com/benjifs/bitbar-slack-team-notifications/issues
