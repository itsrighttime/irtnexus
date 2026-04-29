declare module "core-ui";
declare module "react-syntax-highlighter";
declare module "unist";
declare module "react-syntax-highlighter/dist/esm/styles/prism";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
