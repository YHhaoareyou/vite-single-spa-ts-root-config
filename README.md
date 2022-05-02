# vite-single-spa-ts-root-config

This is the Root-config of an example micro-frontends project with Vite and single-spa implemented together.
Instead of Webpack, this project uses Vite & TypeScript for each micro-frontends app and even the root-config.

The examples of other micro-frontends app in the same project:
* React: https://github.com/YHhaoareyou/vite-single-spa-ts-react-example
* Vue: https://github.com/YHhaoareyou/vite-single-spa-ts-vue-example

This project originally refers to the great work of https://github.com/joeldenning/vite-single-spa-root-config .

*PS. This Root-config uses `single-spa-layout`.*

## Motivation

My team is working on an open source project [WasedaTime](https://github.com/wasedatime/wasedatime-web) in Japan, using ReactJS and single-spa as our micro-frontends framework.

Recently we are migrating from Webpack to Vite, and we would like to share our solutions after experiencing many nights of frustration, so I created this example project.

Please forgive us if there are any redundant configurations in this example, and it would be really appreciated if you would like to share any better solutions.

We hope this example would help anyone who are facing similar problems & make contributions to the developer communities of both single-spa and Vite!

*Here is the branch of the webpack-to-vite migration of the project we are actually working on: https://github.com/wasedatime/wasedatime-web/tree/feature/vite*

## How?

Vite on development doesn't interop with SystemJS, which is used by single-spa as the default build tool.
In order to make Vite interop with single-spa in both development and production environment, this project adopts [es-module-shims](https://github.com/guybedford/es-module-shims) and adjusts the configuration on the paths to styles and public assets of each app.

## Special thanks

* [@AustinZhu](https://github.com/AustinZhu) for helping me with the configurations
* [@filoxo](https://github.com/filoxo) for sharing problems and ideas about the interop issue [here](https://github.com/single-spa/single-spa.js.org/issues/538)

## Getting started

### Local development

1. Follow the instructions at [the Vue example](https://github.com/YHhaoareyou/vite-single-spa-ts-vue-example) to run the Vue Vite application locally, as well as [the React example](https://github.com/YHhaoareyou/vite-single-spa-ts-react-example) to run the React Vite application locally
2. Run the following commands in this root config project
```sh
pnpm install
pnpm run dev
open http://localhost:3000
```
These commands install packages and run this project for your local development.

3. Enjoy! Navigate by the top nav bar, or access http://localhost:3000/vue for the Vue app, as well as http://localhost:3000/react for the React one.

### Production (preview on local)

1. Follow the instructions at https://github.com/YHhaoareyou/vite-single-spa-ts-vue-example to build the Vue vite application, as well as https://github.com/YHhaoareyou/vite-single-spa-ts-react-example to build the React vite application
2. Run the following commands in this root config project
```sh
pnpm install
pnpm run build
pnpm run preview
open http://localhost:9000
```
These commands install packages, build this project, and run the built files for you to preview on your local environment.

3. Enjoy! Navigate by the top nav bar, or access http://localhost:9000/vue for the Vue app, as well as http://localhost:9000/react for the React one.

### Before deployment

Set the environment variables `VITE_MF_VUE_PROD_DOMAIN` and `VITE_MF_REACT_PROD_DOMAIN` to the domains where you host the Vue/React micro-frontends apps.

This example project uses `dotenv` in `vite.config.ts` to parse environment variables from `src/.env`. Please make necessary changes if you set your environment variables in different ways.

## Implementation details

Here we share the implementation details in this project.

### Remove Webpack
Just remove Webpack config file and any Webpack-related libraries, plugins, etc. in the root-config and each micro-frontends app.

### Vite installation and configuration
1. Please refer to `package.json` of our root-config and each micro-frontends app to check necessary dependencies.
2. Please refer to `vite.config.ts` & `tsconfig.json` of our root-config and each micro-frontends app to check the configurations.
We configure the `base` option in `vite.config.ts` in each micro-frontends app so that each app accesses the correct path to one's own public assets in different environment:
```sh
const publicAssetsBaseUrl =
  mode === "production"
    ? parsed.VITE_MF_REACT_PROD_DOMAIN + "/"
    : "http://localhost:3002/";

...

base: publicAssetsBaseUrl
```

### index.html
In root-config, change `src/index.ejs` to `src/index.html`.
Critical changes in the index files are displayed below:

1. Add this inside the head section to adopt es-module-shims:
```sh
<script async src="https://ga.jspm.io/npm:es-module-shims@1.5.4/dist/es-module-shims.js"></script>
```
2. Add the import map inside the head section.
```sh
<% if (isLocal) { %>
  <script type="importmap-shim" defer>
    {
      "imports": {
        "@vite-single-spa/root-config": "//localhost:3000/vite-single-spa-root-config.ts",
        "@vite-single-spa/vue": "//localhost:3001/vite-single-spa-vue.ts",
        "@vite-single-spa/react": "//localhost:3002/vite-single-spa-react.ts"
      }
    }
  </script>
<% } else { %>
  <script type="importmap-shim" defer>
    {
      "imports": {
        "@vite-single-spa/root-config": "/vite-single-spa-root-config.js",
        "@vite-single-spa/vue": "<%= VITE_MF_VUE_PROD_DOMAIN %>/vite-single-spa-vue.js",
        "@vite-single-spa/react": "<%= VITE_MF_REACT_PROD_DOMAIN %>/vite-single-spa-react.js"
      }
    }
  </script>

  <!-- In production environment, css files of each app are not loaded correctly (the paths start with root-config's domain), so in index.html we preload them using each app's domain explicitly -->

  <link rel="preload" href="<%= VITE_MF_VUE_PROD_DOMAIN %>/assets/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="<%= VITE_MF_VUE_PROD_DOMAIN %>/assets/style.css"></noscript>
  <link rel="preload" href="<%= VITE_MF_REACT_PROD_DOMAIN %>/assets/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="<%= VITE_MF_REACT_PROD_DOMAIN %>/assets/style.css"></noscript>
<% } %>
```
3. In `body` tag, replace:
```sh
<script>
  System.import('...');
</script>
```
with:
```sh
<script type="module-shim" src="/vite-single-spa-root-config.<%= isLocal ? 'ts' : 'js' %>"></script>
```
4. Check the console of the browser and add necessary configurations in the Content-Security-Policy tag.
