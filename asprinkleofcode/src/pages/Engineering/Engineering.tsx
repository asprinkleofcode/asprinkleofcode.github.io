import PathIndex from "../../components/PathIndex/PathIndex";
import { pathLabel } from "../../lib/paths";
import { getPathEntries } from "../../lib/registry";

export default function Engineering() {
  return <PathIndex title={pathLabel("engineering")} entries={getPathEntries("engineering")} />;
}
