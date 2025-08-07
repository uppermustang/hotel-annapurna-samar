/// <reference types="react-scripts" />

declare module "react-dom" {
  import * as ReactDOM from "react-dom";
  export = ReactDOM;
}

declare module "react-tabs" {
  export const Tab: any;
  export const Tabs: any;
  export const TabList: any;
  export const TabPanel: any;
}

declare module "react-quill" {
  import * as React from "react";
  interface ReactQuillProps {
    value?: string;
    onChange?: (value: string) => void;
    [key: string]: any;
  }
  const ReactQuill: React.ComponentType<ReactQuillProps>;
  export default ReactQuill;
}
