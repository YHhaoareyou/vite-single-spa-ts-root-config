import { registerApplication, start } from "single-spa";

registerApplication({
  name: "vite-single-spa-ts-vue-example",
  app: () =>
    import(
      /* webpackIgnore: true */
      // @ts-ignore
      "http://localhost:3000/src/main"
    ),
  activeWhen: ["/vue"],
});

registerApplication({
  name: "vite-single-spa-ts-react-example",
  app: () =>
    import(
      /* webpackIgnore: true */
      // @ts-ignore
      "http://localhost:3001/src/main"
    ),
  activeWhen: ["/", "/react"],
});

start({
  urlRerouteOnly: true,
});
