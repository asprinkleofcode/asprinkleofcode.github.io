import { Badge } from "flowbite-react";
import { CAPABILITY_LABELS, capabilityLabel } from "../../lib/capabilities";
import type { Capability } from "../../lib/frontmatter";

interface CapabilitySignalProps {
  /** From the controlled vocabulary only; the label is never free text. */
  capability: Capability;
}

/**
 * One capability a story demonstrates, as a periwinkle pill (DESIGN §7a,
 * UX-DR11). MDX bodies aren't type-checked, so an unknown value throws.
 */
export default function CapabilitySignal({ capability }: CapabilitySignalProps) {
  if (!Object.hasOwn(CAPABILITY_LABELS, capability)) {
    throw new Error(`CapabilitySignal: unknown capability "${String(capability)}"`);
  }
  return <Badge color="capability">{capabilityLabel(capability)}</Badge>;
}
