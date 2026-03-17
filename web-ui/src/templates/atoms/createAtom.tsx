import {
  ATOM_COMPONENT_MAP,
  type AtomComponents,
} from "./configs/atom-component-map";
import { ATOM_PRESETS } from "./configs/atom-presets";

// Generic abstract factory
export function createAtom<
  K extends keyof AtomComponents, // only implemented atoms
  P extends keyof (typeof ATOM_PRESETS)[K], // preset type
  S extends string = "default", // optional sub-preset
>(atom: K, preset: P, subPreset?: S) {
  // Pick subPreset if exists, otherwise fallback to "default"
  const presetObj = ATOM_PRESETS[atom][preset] as Record<string, any>;
  const config =
    subPreset && presetObj[subPreset]
      ? presetObj[subPreset]
      : presetObj["default"];

  return function AtomFactory(props: any) {
    const Component = getAtomComponent(atom);
    return <Component {...config} {...props} />;
  };
}

// Helper to get the React component
function getAtomComponent<K extends keyof AtomComponents>(
  atom: K,
): AtomComponents[K] {
  const component = ATOM_COMPONENT_MAP[atom];
  if (!component) throw new Error(`Atom "${atom}" is not implemented`);
  return component;
}
