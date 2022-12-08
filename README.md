# Sitecore Commerce Seller Application

This application has been developed as a kick starter for the customer and partner community. It is a lightweight version built with React, Next.JS, Typescript and utilizing Chakra UI to make a OrderCloud seller application that can be used to quickly spin up POCs or projects.

## 🔋 ⚡ OrderCloud React Seller Application

- ✔️ toolings for linting, formatting, and conventions configured

  `eslint`, `prettier`, `husky`, `lint-staged`, `commitlint`, `commitizen`, and `standard-version`

- 🔎 SEO optimization configured

  with `next-seo` and `next-sitemap`. you'll need to reconfigure or tinker with it to get it right according to your needs, but it's there if you need it.

Built with:

- 🎨 React
- 🎨 Next.JS
- 🎨 Typescript
- 🎨 Chakra UI

## Getting Started

Getting started with the Sitecore Commerce application is as simple as creating a feature branch from the development branch. When you are done with your feature release create a Pull Request that can be reviewed by the SE team.  We have set up the Main branch to automatically deploy to our Vercel hosted applicaiton once a merge is complete. We will manually merge development into Main when we are ready to deploy new features. 

Then, run the development server:

```bash
yarn dev
```
Use Yarn to do your development. This will help when you checkin, we are pushing to Vercel and they will run "yarn run build" to check if the project will build

Before checking in verify that the new code passes.
```yarn lint
yarn tsc --noEmit
yarn run build
```

A script called pre-commit to run those 3 commands. 

```yarn pre-commit. 
```

Also used in Git Commit Hook. 
If you need to ignore and force your commit (For team review purpose for example) simply do 
```git commit --no-verify -m "commit message"
```

If it passes these three commands it should be ready to be checked in.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/lib/pages/index.tsx`. The page auto-updates as you edit the file.


## Existing Code as an Example  

There is a project on OrderClouds GitHub repo called HeadStart Next.
https://github.com/ordercloud-api/headstart-nextjs

The above project was written for a seller application but should give you a example of how the calls work within react using hooks and redux. The code is well laid out and can jump start you getting going with React and OrderCloud.

Questions can be sent to george.haeger@sitecore.com
