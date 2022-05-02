import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

// registerApplication({
//   name: "vite-single-spa-ts-vue-example",
//   app: () =>
//     import(
//       /* webpackIgnore: true */
//       // @ts-ignore
//       "http://localhost:3000/src/main"
//     ),
//   activeWhen: ["/vue"],
// });

// registerApplication({
//   name: "vite-single-spa-ts-react-example",
//   app: () =>
//     import(
//       /* webpackIgnore: true */
//       // @ts-ignore
//       "http://localhost:3001/src/main"
//     ),
//   activeWhen: ["/", "/react"],
// });

const routes = constructRoutes(document.querySelector("#single-spa-layout"));
const applications = constructApplications({
  routes,
  loadApp: ({ name }) =>
    import(
      /* @vite-ignore */
      // @ts-ignore
      name
    ),
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();

// start({
//   urlRerouteOnly: true,
// });
