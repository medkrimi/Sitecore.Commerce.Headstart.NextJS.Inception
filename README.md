# Sitecore Commerce Seller app
Welcome to Sitecore Commerce Seller App. This is a basic implementation of the Sitecore Commerce using the Order Cloud Javascript SDK. 
You can use it as a starting point to discover, undrestand and learn more about the Sitecore Commerce Order Cloud capabilities. 

This app showcase different marketplace scenarios and commerce strategies B2B, B2C, B2B2C.

## What is Sitecore Commerce Order Cloud?
----
[OrderCloud](https://ordercloud.io/discover/platform-overview) is a B2B, B2C, B2X commerce and marketplace development platform, 
OrderCloud delivers cloud-based, API-first, headless eCommerce architecture. Limitless customizations and endless freedom for growth to support your complete commerce strategy.

## What is Sitecore Commerce Seller App?
----
A **simple**, **powerful** and **flexible** Commerce Seller Application built on top of Sitecore [Order Cloud API](https://ordercloud.io/api-reference) and the [Javascript SDK](https://www.npmjs.com/package/ordercloud-javascript-sdk) built with:
* React
* Next.JS
* Typescript
* Chakra UI
* Toolings for linting, formatting, and conventions configured `eslint`, `prettier`, `husky`, `lint-staged`, `commitlint`, `commitizen`, and `standard-version`
* SEO optimization configured with `next-seo` and `next-sitemap`. you'll need to reconfigure or tinker with it to get it right according to your needs, but it's there if you need it.

## What you can do with this app?
---- 
* Create, read, update delete product catalogs and categories
* Create, read, update delete products with Extended propreties
* Create, read, update delete promotions
* Create, read, update, delete buyers
* Create, read, update, delete user groups and users
* Read, Update Orders

## Requirement
Create an Order Cloud Marketplace instance (https://portal.ordercloud.io)

## How do I get started? 
Using the Deploy Button below, you'll deploy on Vercel the Next.js project as well as connect it to your Sitecore Commerce Order Cloud sandbox.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSitecoreNA%2Fsitecore-commerce%2Ftree%2Fmain)

## Working locally
----
1. Pull the latest version from this github repository
2. Copy the `.env.local.example` file in the root directory to `.env.local` (ignored by default during your next Git commit):

```bash
cp .env.local.example .env.local
```

Then set each variable on `.env.local`:
`NEXT_PUBLIC_APP_NAME` Application Name used on Page title. 
`NEXT_PUBLIC_OC_CLIENT_ID` ClientID from portal.ordercloud.io  
`NEXT_PUBLIC_OC_API_URL`='https://sandboxapi.ordercloud.io' Sandbox URL from portal.ordercloud.io  
`NEXT_PUBLIC_OC_MARKETPLACE_ID` 
`NEXT_PUBLIC_OC_MARKETPLACE_NAME`
`NEXT_PUBLIC_OC_USELIVEANALYTICSDATA`='false'

Your `.env.local` file should look like this:

```bash
NEXT_PUBLIC_APP_NAME='Sitecore Commerce Seller App'
NEXT_PUBLIC_OC_CLIENT_ID='****0BAC-****-4711-B01F-1A**4F7*****'
NEXT_PUBLIC_OC_API_URL='https://sandboxapi.ordercloud.io'
NEXT_PUBLIC_OC_MARKETPLACE_ID='SitecoreCommerce'
NEXT_PUBLIC_OC_MARKETPLACE_NAME='Sitecore Commerce'
NEXT_PUBLIC_OC_USELIVEANALYTICSDATA='false'
```

3. Run Next.js in development mode
```bash
yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)! 
If it doesn't work, post on [GitHub issues](https://github.com/medkrimi/commercenext.js/discussions).

### Deploy on Vercel
To deploy your local project to Vercel, push it to public GitHub/GitLab/Bitbucket repository then [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

## Not implemented / on the Roadmap
* Create, read, update, delete sellers and suppliers
* Create, read, update, delete addresses
* ....

## References
- [Order Cloud Javascript SDK](https://www.npmjs.com/package/ordercloud-javascript-sdk)
- [Order Cloud API Reference](https://ordercloud.io/api-reference)
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Chakra UI](https://chakra-ui.com)
- [TypeScript](https://www.typescriptlang.org)
