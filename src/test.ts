const 最大生命     = Symbol("最大生命"    ); //基础加值
const 速度         = Symbol("速度"        );
const 防御         = Symbol("防御"        );
const 初始怒气     = Symbol("初始怒气"    );
const 闪避         = Symbol("闪避"        );
const 最大怒气     = Symbol("最大怒气"    );
const 怒气回复     = Symbol("怒气回复"    );
const 雷电伤害     = Symbol("雷电伤害"    ); //攻击加值 //基础伤害类型
const 冰霜伤害     = Symbol("冰霜伤害"    );
const 火焰伤害     = Symbol("火焰伤害"    );
const 魔法伤害     = Symbol("魔法伤害"    );
const 物理伤害     = Symbol("物理伤害"    );
const 电击伤害     = Symbol("电击伤害"    );
const 极寒伤害     = Symbol("极寒伤害"    );
const 燃烧伤害     = Symbol("燃烧伤害"    );
const 暗蚀伤害     = Symbol("暗蚀伤害"    );
const 流血伤害     = Symbol("流血伤害"    );
const 治疗伤害     = Symbol("治疗伤害"    );
const 固定伤害     = Symbol("固定伤害"    );
const 雷电附伤     = Symbol("雷电附伤"    ); //附伤
const 冰霜附伤     = Symbol("冰霜附伤"    );
const 火焰附伤     = Symbol("火焰附伤"    );
const 魔法附伤     = Symbol("魔法附伤"    );
const 物理附伤     = Symbol("物理附伤"    );
const 电击附伤     = Symbol("电击附伤"    );
const 极寒附伤     = Symbol("极寒附伤"    );
const 燃烧附伤     = Symbol("燃烧附伤"    );
const 暗蚀附伤     = Symbol("暗蚀附伤"    );
const 流血附伤     = Symbol("流血附伤"    );
const 治疗附伤     = Symbol("治疗附伤"    );
const 固定附伤     = Symbol("固定附伤"    );
const 普攻伤害     = Symbol("普攻伤害"    ); //技能伤害类型
const 核心伤害     = Symbol("核心伤害"    );
const 秘术伤害     = Symbol("秘术伤害"    );
const 奥义伤害     = Symbol("奥义伤害"    );
const 其他伤害     = Symbol("其他伤害"    );
const 技能伤害     = Symbol("技能伤害"    ); //其他攻击加值
const 攻击         = Symbol("攻击"        );
const 暴击率       = Symbol("暴击率"      );
const 暴击伤害     = Symbol("暴击伤害"    );
const 所有伤害     = Symbol("所有伤害"    );
const 伤害系数     = Symbol("伤害系数"    );
const 受到雷电伤害 = Symbol("受到雷电伤害"); //受击加值 //基础伤害类型
const 受到冰霜伤害 = Symbol("受到冰霜伤害");
const 受到火焰伤害 = Symbol("受到火焰伤害");
const 受到魔法伤害 = Symbol("受到魔法伤害");
const 受到物理伤害 = Symbol("受到物理伤害");
const 受到电击伤害 = Symbol("受到电击伤害");
const 受到极寒伤害 = Symbol("受到极寒伤害");
const 受到燃烧伤害 = Symbol("受到燃烧伤害");
const 受到暗蚀伤害 = Symbol("受到暗蚀伤害");
const 受到流血伤害 = Symbol("受到流血伤害");
const 受到治疗伤害 = Symbol("受到治疗伤害");
const 受到固定伤害 = Symbol("受到固定伤害");
const 受到雷电附伤 = Symbol("受到雷电附伤"); //附伤
const 受到冰霜附伤 = Symbol("受到冰霜附伤");
const 受到火焰附伤 = Symbol("受到火焰附伤");
const 受到魔法附伤 = Symbol("受到魔法附伤");
const 受到物理附伤 = Symbol("受到物理附伤");
const 受到电击附伤 = Symbol("受到电击附伤");
const 受到极寒附伤 = Symbol("受到极寒附伤");
const 受到燃烧附伤 = Symbol("受到燃烧附伤");
const 受到暗蚀附伤 = Symbol("受到暗蚀附伤");
const 受到流血附伤 = Symbol("受到流血附伤");
const 受到治疗附伤 = Symbol("受到治疗附伤");
const 受到固定附伤 = Symbol("受到固定附伤");
const 受到普攻伤害 = Symbol("受到普攻伤害"); //技能伤害类型
const 受到核心伤害 = Symbol("受到核心伤害");
const 受到秘术伤害 = Symbol("受到秘术伤害");
const 受到奥义伤害 = Symbol("受到奥义伤害");
const 受到其他伤害 = Symbol("受到其他伤害");
const 受到技能伤害 = Symbol("受到技能伤害"); //其他攻击加值
const 受到攻击     = Symbol("受到攻击"    );
const 受到暴击率   = Symbol("受到暴击率"  );
const 受到暴击伤害 = Symbol("受到暴击伤害");
const 受到所有伤害 = Symbol("受到所有伤害");
const 受到伤害系数 = Symbol("受到伤害系数");


const BaseModifyTypeList = [
    最大生命,
    速度    ,
    防御    ,
    初始怒气,
    闪避    ,
    最大怒气,
    怒气回复,
] as const;
type BaseModifyType = typeof BaseModifyTypeList[number];
const DamageTypeList = [
    雷电伤害,
    冰霜伤害,
    火焰伤害,
    魔法伤害,
    物理伤害,
    电击伤害,
    极寒伤害,
    燃烧伤害,
    暗蚀伤害,
    流血伤害,
    治疗伤害,
    固定伤害,
] as const;
type DamageType = typeof BaseModifyTypeList[number];





