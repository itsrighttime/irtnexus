import type { BaseProps } from "@/types";
import React from "react";

export type ElementType = React.ElementType;

export type PolymorphicRef<C extends ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type PolymorphicProps<C extends ElementType, Props = {}> =
  Props &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props> & {
    as?: C;
  };

export type ButtonOwnProps = BaseProps & {
  children?: React.ReactNode;

  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "destructive";

  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;

  block?: boolean;
};

export type ButtonProps<C extends ElementType> =
  PolymorphicProps<C, ButtonOwnProps>;

export type ButtonComponent = <C extends ElementType = "button">(
  props: ButtonProps<C> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;