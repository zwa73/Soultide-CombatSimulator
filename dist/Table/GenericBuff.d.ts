import { Buff } from "../Modify";
import { SkillType } from "..";
export declare namespace GenericBuff {
    const 暗蚀: Buff;
    const 极寒: Buff;
    const 弱点Gen: (lvl?: number, ...dmgCons: SkillType[]) => Buff;
    const 全弱点Gen: (lvl?: number) => Buff;
    const 弱点击破: Buff;
}
