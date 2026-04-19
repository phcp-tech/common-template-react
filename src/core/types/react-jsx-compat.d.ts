/**
 * Global JSX namespace shim for React 19 compatibility.
 *
 * Layer: core/types — ambient declaration file, no runtime output.
 *
 * React 19 removed the legacy global `JSX` namespace and moved everything
 * under `React.JSX`. This file re-exports the React 19 JSX types into the
 * global `JSX` namespace so that third-party libraries and `.tsx` files that
 * still reference the global namespace continue to type-check correctly.
 *
 * Constraint: this is a `.d.ts` ambient module — it must not contain any
 * runtime code or imports beyond `import type`.
 */
import type * as React from "react";

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};
