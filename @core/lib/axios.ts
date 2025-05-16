import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

if (!baseURL) {
  throw new Error(
    "Environment variable NEXT_PUBLIC_NEXTAUTH_URL is not defined."
  );
}

const isDev = process.env.NODE_ENV === "development";
const isLocalhost = baseURL.startsWith("http://localhost");

if (!baseURL.startsWith("https://") && !(isDev && isLocalhost)) {
  throw new Error(
    `Insecure baseURL detected: ${baseURL}. Use HTTPS in NEXT_PUBLIC_NEXTAUTH_URL.`
  );
}

const defaultHeaders = { "Content-Type": "application/json" };

/**
 * Creates and configures an Axios instance with predefined settings.
 *
 * @constant
 * @type {AxiosInstance}
 * @description
 * This Axios instance is pre-configured with a base URL and default headers,
 * allowing for consistent API requests throughout the application.
 *
 * @see {@link https://axios-http.com/docs/instance} for more details on Axios instances.
 */
const axiosInstance = axios.create({
  baseURL,
  headers: defaultHeaders,
});

/**
 * An Axios instance pre-configured with authentication settings.
 *
 * This instance is created using the `axios.create` method and is configured
 * with a base URL and default headers for making HTTP requests.
 *
 * @constant
 */
const axiosAuth = axios.create({
  baseURL,
  headers: defaultHeaders,
});

export { axiosInstance, axiosAuth };
/**
 * An instance of Axios pre-configured with default settings for making HTTP requests.
 * This instance can be used throughout the application to ensure consistent behavior
 * such as base URL, headers, and interceptors.
 *
 * @remarks
 * Customize this instance as needed to include additional configurations like
 * authentication tokens, timeout settings, or error handling logic.
 *
 * @example
 * ```typescript
 * import axiosInstance from '@core/lib/axios';
 *
 * axiosInstance.get('/endpoint')
 *   .then(response => console.log(response.data))
 *   .catch(error => console.error(error));
 * ```
 */
export default axiosInstance;
