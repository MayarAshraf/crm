import packageJson from "../../package.json";

const version = "1.0.0";
const hostname = window.location.hostname;
const defaultHostname =
  !hostname || hostname === "localhost" || hostname === "8xcrm.work" ? "8x" : hostname;

export const environment = {
  production: true,
  API_VERSION: "v1",
  API_URL: `https://${defaultHostname}.8xcrm.com/api`,
  version: `${version || packageJson.version} Beta`,
};
