import PathIndex from "../../components/PathIndex/PathIndex";
import { pathLabel } from "../../lib/paths";
import { getPathEntries } from "../../lib/registry";

export default function Leadership() {
  return <PathIndex title={pathLabel("leadership")} entries={getPathEntries("leadership")} />;
}
