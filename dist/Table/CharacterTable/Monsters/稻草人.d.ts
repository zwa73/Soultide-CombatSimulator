import { Character } from "../../../Character";
import { StaticStatusOption } from "../../../Status";
export declare const 稻草人: {
    baseStatus: Partial<import("../../../Status").StaticStatus>;
    genChar(name: string, status: StaticStatusOption): Character;
};
