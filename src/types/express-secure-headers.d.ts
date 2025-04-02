declare module 'express-secure-headers' {
  interface SecureHeadersOptions {
    contentSecurityPolicy?: {
      directives: {
        defaultSrc?: string[];
        scriptSrc?: string[];
        styleSrc?: string[];
        imgSrc?: string[];
        connectSrc?: string[];
        fontSrc?: string[];
        objectSrc?: string[];
        mediaSrc?: string[];
        frameSrc?: string[];
      };
    };
    xFrameOptions?: string;
    xContentTypeOptions?: string;
    xXSSProtection?: string;
    strictTransportSecurity?: string;
    referrerPolicy?: string;
    permissionsPolicy?: {
      geolocation?: string;
      microphone?: string;
      camera?: string;
      payment?: string;
      usb?: string;
      fullscreen?: string;
      'interest-cohort'?: string;
    };
  }

  function secureHeaders(options?: SecureHeadersOptions): express.RequestHandler;
  export default secureHeaders;
}
