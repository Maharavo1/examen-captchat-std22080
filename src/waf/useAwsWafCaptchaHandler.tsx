import { useEffect } from "react";
import { AWS_WAF_TOKEN_HEADER_KEY, awsWafToken, loadAwsWafScript } from "../waf";
import { getAxiosInstance } from "../conf/axios";

export const useAwsWafCaptchaHandler = () => {
  useEffect(() => {
    const axiosInstance = getAxiosInstance();
    let requestInterceptor: number;

    const initializeInterceptors = async () => {
      await loadAwsWafScript();
      requestInterceptor = axiosInstance.interceptors.request.use(
        async (config) => {
          config.headers[AWS_WAF_TOKEN_HEADER_KEY] = await awsWafToken();
          return config;
        },
        (err) => Promise.reject(err)
      );
    };

    initializeInterceptors();

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, []);
};