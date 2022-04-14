import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@org/vite-example",
  app: () =>
    import(
      /* webpackIgnore: true */
      // @ts-ignore
      "http://localhost:3000/src/main"
    ),
  activeWhen: ["/", "/vue"],
});

// registerApplication({
//   name: "@vite-test/navbar",
//   app: () => System.import("@vite-test/navbar"),
//   activeWhen: ["/"]
// });

start({
  urlRerouteOnly: true,
});
