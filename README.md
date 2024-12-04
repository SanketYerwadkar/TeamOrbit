# TeamOrbit Platform

## ⭐️ What is it?

[](https://app.ever.team) - Open Work and Project Management Platform.

![web](https://docs.ever.team/web/overview.png)

**NOTE: Platform currently is in active development stage / WIP, please use with caution!**

## ✨ Features

Below is a list of the most important planned features:

-   Work / Workforce Management
-   Time Management / Time Tracking / Activity Tracking
-   Productivity Tracking & Metrics
-   Projects / Tasks & Issues Management
-   Organizations / Teams
-   Tags / Labels
-   Integrations (GitHub, GitLab, Bitbucket, JIRA, etc.)
-   Dark / Black / Light Themes

## 🌼 Screenshots

<details>
<summary>Show / Hide Screenshots</summary>

### Web Platform

![web](https://docs.ever.team/web/overview.png)
![web](https://docs.ever.team/web/web2.png)
![web](https://docs.ever.team/web/web3.png)

### Mobile Apps (iOS/Android)

![mobile](https://docs.ever.team/mobile/overview.png)

Note: Currently WIP, the screenshot is just a temporary picture :)

</details>

## 📊 Activity

![Alt](https://repobeats.axiom.co/api/embed/7dc568c25f12884ca41e421ad2ae0b6dc1e576b1.svg 'Repobeats analytics image')

## ⚡️ Our Open Platforms

## 🧱 Technology Stack and Requirements

-   [TypeScript](https://www.typescriptlang.org)
-   [Nx](https://nx.dev) and [Lerna](https://github.com/lerna/lerna)
-   [NodeJs](https://nodejs.org)
-   [Next.js](https://nextjs.org)
-   [React](https://reactjs.org)
-   [React Native](https://reactnative.dev)
-   [Expo](https://expo.dev)
-   [Tailwind](https://tailwindcss.com) - CSS / Styles
-   [shadcn/ui](https://ui.shadcn.com), [Radix](https://www.radix-ui.com) and [HeadlessUI](https://headlessui.com) - UI Component Libraries
-   [DigitalOcean](https://www.digitalocean.com) and [Vercel](https://vercel.com) - Hosting

#### See also README.md and CREDITS.md files in relevant folders for lists of libraries and software included in the Platform, information about licenses, and other details

## 📄 Documentation

Please refer to our official [Platform Documentation](https://docs.ever.team) (WIP) and to our [Wiki](https://github.com/ever-co/ever-teams/wiki) (WIP).

## 🚀 Getting Starting

### Super Quick Start

<https://app.ever.team>

### Quick Start with our public live APIs

1. Clone this repo
2. Run `yarn install`
3. Run `yarn build:web && yarn start:web` OR `yarn start:web:dev`
4. Open in <http://localhost:3030> in your Browser

Notes:

-   by default, Ever Teams web frontend will be connected to our production [Ever Gauzy API](https://github.com/ever-co/ever-gauzy) API endpoint <https://api.ever.team>. You can change it in environment variables `GAUZY_API_SERVER_URL` and `NEXT_PUBLIC_GAUZY_API_SERVER_URL`, see below how to run with a Self-hosted Backend.

### Run with a Self-hosted Backend

1. Download and run the Ever Gauzy Server setup (<https://gauzy.co/downloads>) or run the server manually (see <https://github.com/ever-co/ever-gauzy/tree/develop/apps/server>). You can also run only Ever Gauzy APIs (manually), see <https://github.com/ever-co/ever-gauzy/tree/develop/apps/api>. For getting starting instructions, it's best to check the Ever Gauzy [README](https://github.com/ever-co/ever-gauzy/blob/develop/README.md) file.
2. Clone this repo
3. After you get the API or Server running, make sure you set the environment variables `GAUZY_API_SERVER_URL` and `NEXT_PUBLIC_GAUZY_API_SERVER_URL` in Ever Teams .env file (see <https://github.com/ever-co/ever-teams/blob/develop/web/.env.sample>). For example, you can set those env vars to <http://localhost:3000> if Gauzy APIs run on that host & port.
4. Run `yarn install`
5. Run `yarn build:web && yarn start:web` OR `yarn start:web:dev`
6. Open in <http://localhost:3030> in your Browser

#### Notes

Note: Ever® Teams™ requires access to Ever® Gauzy™ Platform APIs, provided by another project - Ever® Gauzy™ Platform, see <https://github.com/ever-co/ever-gauzy> (and also <https://gauzy.co>). Specifically, you might be interested in the `apps/api` and `apps/server` folders of the mono-repo for the Gauzy API & Gauzy Server code.

### Run in Gitpod

-   Launch a ready-to-use Gitpod workspace (WIP):

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ever-co/ever-teams)

### Run in DevContainer

DevContainers for VSCode are supported (WIP).

[Click here to get started.](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/ever-co/ever-teams)

### Run in Docker & Docker Compose

WIP

## 🚗 Self Hosting

### DigitalOcean

Please see our [Wiki](https://github.com/ever-co/ever-teams/wiki/Deploy-to-DigitalOcean).

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fever-co%2Fever-teams&project-name=ever-teams&repository-name=ever-teams&output-directory=.next&build-command=yarn%20build&install-command=yarn%20install%20--frozen-lockfile&root-directory=apps%2Fweb)

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ever-co/ever-teams)

### Railway

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/7_OfzR?referralCode=40jeja)

### Fly

[![Deploy to Fly](https://ever.team/fly.png)](https://github.com/ever-co/ever-teams/wiki/Deploy-to-Fly)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ever-co/ever-teams)

### Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Koyeb

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=ever-teams&type=docker&builder=dockerfile&image=ghcr.io/ever-co/ever-teams-webapp:latest&env[PORT]=3030&ports=3030;http;/)

### Northflank

[Deploy to Northflank](https://app.northflank.com/s/account/templates/new?data=656ed069216b5d387f5379c6)

## 📄 Content

-   `/apps/web` - NextJs-based (React) Web App at <https://app.ever.team> (deployed from `main` branch)
-   `/apps/mobile` - Expo (ReactNative) powered mobile app
-   `/apps/desktop` - Electron-based Desktop Application (customized build from [Ever Gauzy Desktop Timer App](https://github.com/ever-co/ever-gauzy/tree/develop/apps/desktop-timer))
-   `/apps/extensions` - Browser Extensions (powered by <https://github.com/PlasmoHQ/plasmo>)
-   `/apps/server-api` - Ever Teams API Server (customized build from [Ever Gauzy API Server](https://github.com/ever-co/ever-gauzy/tree/develop/apps/server-api))
-   `/apps/server-web` - Electron-based Ever Teams Web Server that serves Ever Teams NextJs frontend (wraps `apps/web` folder)

## 💌 Contact Us

-   [Ever.co Website Contact Us page](https://ever.co/contacts)
-   [Slack Community](https://join.slack.com/t/gauzy/shared_invite/enQtNzc5MTA5MDUwODg2LTI0MGEwYTlmNWFlNzQzMzBlOWExNTk0NzAyY2IwYWYwMzZjMTliYjMwNDI3NTJmYmM4MDQ4NDliMDNiNDY1NWU)
-   [Discord Chat](https://discord.gg/hKQfn4j)
-   [Spectrum Community](https://spectrum.chat/gauzy)
-   [Gitter Chat](https://gitter.im/ever-co/gauzy)
-   [CodeMentor](https://www.codementor.io/evereq)
-   For business inquiries: <mailto:gauzy@ever.co>
-   Please report security vulnerabilities to <mailto:security@ever.co>
-   [Gauzy Platform @ Twitter](https://twitter.com/gauzyplatform)
-   [Gauzy Platform @ Facebook](https://www.facebook.com/gauzyplatform)

## 🔐 Security

**Ever Teams Platform** follows good security practices, but 100% security cannot be guaranteed in any software!
**Ever Teams Platform** is provided AS IS without any warranty. Use at your own risk!
See more details in the [LICENSES.md](LICENSES.md).

In a production setup, all client-side to server-side (backend, APIs) communications should be encrypted using HTTPS/WSS/SSL (REST APIs, GraphQL endpoint, Socket.io WebSockets, etc.).

If you discover any issue regarding security, please disclose the information responsibly by emailing <mailto:security@ever.co> and not by creating a GitHub issue.

## 🛡️ License

This software is available under the following licenses:

-   [Ever® Teams™ Platform Community Edition](https://github.com/ever-co/ever-teams/blob/master/LICENSES.md#ever-teams-platform-community-edition-license)
-   [Ever® Teams™ Platform Small Business](https://github.com/ever-co/ever-teams/blob/master/LICENSES.md#ever-teams-platform-small-business-license)
-   [Ever® Teams™ Platform Enterprise](https://github.com/ever-co/ever-teams/blob/master/LICENSES.md#ever-teams-platform-enterprise-license)

#### The default Ever® Teams™ Platform license, without a valid Ever® Teams™ Platform Enterprise or Ever® Teams™ Platform Small Business License agreement, is the Ever® Teams™ Platform Community Edition License

We support the open-source community. If you're building awesome non-profit/open-source projects, we're happy to help and will provide (subject to [acceptance criteria](https://github.com/ever-co/ever-teams/wiki/Free-license-and-hosting-for-Non-profit-and-Open-Source-projects)) Ever Teams Enterprise edition license and free hosting option! Feel free to contact us at <mailto:ever@ever.co> to make a request. More details are explained in our [Wiki](https://github.com/ever-co/ever-teams/wiki/Free-license-and-hosting-for-Non-profit-and-Open-Source-projects).

#### Please see [LICENSES](LICENSES.md) for more information on licenses

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fever-co%2Fever-teams.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fever-co%2Fever-teams?ref=badge_large)

## ™️ Trademarks

**Ever**® is a registered trademark of [Ever Co. LTD](https://ever.co).
**Ever® Demand™**, **Ever® Gauzy™**, **Ever® Teams™** and **Ever® OpenSaaS™** are all trademarks of [Ever Co. LTD](https://ever.co).

The trademarks may only be used with the written permission of Ever Co. LTD. and may not be used to promote or otherwise market competitive products or services.

All other brand and product names are trademarks, registered trademarks, or service marks of their respective holders.

## 🍺 Contribute

-   Please give us a :star: on Github, it **helps**!
-   You are more than welcome to submit feature requests in the [separate repo](https://github.com/ever-co/feature-requests/issues)
-   Pull requests are always welcome! Please base pull requests against the _develop_ branch and follow the [contributing guide](.github/CONTRIBUTING.md).
