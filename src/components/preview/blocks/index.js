import { BLOCK_IDS } from '../../../config/templates';
import BasicInfoBlock from './BasicInfoBlock';
import SummaryBlock from './SummaryBlock';
import SkillsBlock from './SkillsBlock';
import ExperienceBlock from './ExperienceBlock';
import EducationBlock from './EducationBlock';
import HonorsBlock from './HonorsBlock';

/** 区块 ID 与预览组件的映射，便于按模板顺序渲染 */
export const BLOCK_COMPONENTS = {
  [BLOCK_IDS.BASIC_INFO]: BasicInfoBlock,
  [BLOCK_IDS.SUMMARY]: SummaryBlock,
  [BLOCK_IDS.SKILLS]: SkillsBlock,
  [BLOCK_IDS.EXPERIENCE]: ExperienceBlock,
  [BLOCK_IDS.EDUCATION]: EducationBlock,
  [BLOCK_IDS.HONORS]: HonorsBlock,
};

export { BasicInfoBlock, SummaryBlock, SkillsBlock, ExperienceBlock, EducationBlock, HonorsBlock };
