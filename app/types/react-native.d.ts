/// <reference types="react-native" />

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        View: React.DetailedHTMLProps<any, any>;
        Text: React.DetailedHTMLProps<any, any>;
        Image: React.DetailedHTMLProps<any, any>;
      }
    }
  }
}

declare module "react-native" {
  import * as React from "react";

  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const Image: React.ComponentType<any>;
  export const StyleSheet: {
    create: (styles: any) => any;
  };
}

export {};
