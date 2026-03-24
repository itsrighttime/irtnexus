export type PropRule =
  | string
  | {
      from?: string;
      fallback?: string;
      fromState?: boolean;
      static?: any;
    };

export type PropConfig = Record<string, PropRule>;

export interface FieldUIConfig {
  component: string;
  props: PropConfig;
}

export type FieldUIConfigMap = Record<string, FieldUIConfig>;
