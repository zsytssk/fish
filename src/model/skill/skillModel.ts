import { SkillCoreCom, SkillInfo } from './skillCoreCom';
import { TrackFishModel } from './trackFishModel';
import { BombModel } from './bombModel';
import { FreezeModel } from './freezeModel';
import { AutoLaunchModel } from './autoLaunchModel';
import { SkillMap } from 'data/config';

/** 技能的接口 */
export interface SkillModel {
    skill_core: SkillCoreCom;
    active(info: SkillInfo): void;
    disable(): void;
}

/** 技能的树... */
export const SkillCtorMap = {
    [SkillMap.Freezing]: FreezeModel,
    [SkillMap.Bomb]: BombModel,
    [SkillMap.TrackFish]: TrackFishModel,
    [SkillMap.Auto]: AutoLaunchModel,
};
