/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { axiosAuth } from "../lib/axios";

/**
 * Custom hook that configures an Axios instance to include an authorization token
 * in the request headers if a user session is available.
 *
 * This hook uses the `useSession` hook to retrieve the current session data and
 * sets up an Axios request interceptor to automatically add the `Authorization`
 * header with a Bearer token for authenticated requests.
 *
 * The interceptor is cleaned up when the component using this hook unmounts or
 * when the session changes.
 *
 * @returns {typeof axiosAuth} The configured Axios instance with the authorization interceptor applied.
 */
const useAxiosAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const token = (session.user as { token?: string })?.token;

    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        if ((config.headers as any).set) {
          (config.headers as any).set("Authorization", `Bearer ${token}`);
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
    };
  }, [session]);

  return axiosAuth;
};

export default useAxiosAuth;
