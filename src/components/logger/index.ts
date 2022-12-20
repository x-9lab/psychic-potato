import { name, version } from "../../../package.json";
import { upCaseFirstChar } from "@components/helper";
import getLogger from "@x-drive/logger";

const part = name.split("-");
const Logger = getLogger(`${upCaseFirstChar(part[part.length - 1])}(v${version})`);

export default Logger;

export { getLogger }