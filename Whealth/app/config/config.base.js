/**
 * Configuration base for the application settings.
 * @property {("always"|"dev"|"prod"|"never")} persistNavigation - Controls when navigation state should be persisted:
 *   - "always": Persist navigation state always.
 *   - "dev": Persist navigation only in development mode.
 *   - "prod": Persist navigation only in production mode.
 *   - "never": Never persist navigation state.
 * @property {("always"|"dev"|"prod"|"never")} catchErrors - Controls error catching behavior:
 *   - "always": Catch errors always.
 *   - "dev": Catch errors only in development mode.
 *   - "prod": Catch errors only in production mode.
 *   - "never": Never catch errors.
 * @property {string[]} exitRoutes - List of route names that will cause the app to exit when the back button is pressed on Android.
 */
const BaseConfig = {
  persistNavigation: "dev",
  catchErrors: "always",
  exitRoutes: ["Welcome"],
};

export default BaseConfig;
