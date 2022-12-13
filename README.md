# Stream Deck Slack Status

This plugin updates the slack status.

![screenshot](./images/image2.png)

## Installation

Install from the [store page](https://apps.elgato.com/plugins/net.ellreka.slack-status).

### Manually

Download the plugin. [here](https://github.com/ellreka/streamdeck-slack-status/releases)

Open `net.ellreka.slack-status.streamDeckPlugin` file.

## Setup

![screenshot](./images/image1.png)

### How to get the slack token

⚠️ **Caution** ⚠️

In v1.0.2, you can change the presence of users.
Please add `users:write` to permissions if you want to use it.

1. Create [App](https://api.slack.com/apps) on Slack.
2. Add **User Token Scope** in the **OAuth & Permissions** section.
   - `users.profile:write`
   - `users:write`
3. Install App.
4. Copy **User OAuth Token** (`xoxp-xxxxxxxxxxxxxx`).

## Actions

- Update Slack Status
- Clear Slack Status
