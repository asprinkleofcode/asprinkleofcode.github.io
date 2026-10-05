import PathIndex from "../../components/PathIndex/PathIndex";
import { pathLabel } from "../../lib/paths";
import { getPathEntries } from "../../lib/registry";

export default function Beyond() {
  return <PathIndex title={pathLabel("beyond")} entries={getPathEntries("beyond")} />;
}
