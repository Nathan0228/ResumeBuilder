import { BLOCK_IDS } from '../../../config/templates';
import BasicInfoBlock from './BasicInfoBlock';
import SummaryBlock from './SummaryBlock';
import SkillsBlock from './SkillsBlock';
import ExperienceBlock from './ExperienceBlock';
import EducationBlock from './EducationBlock';
import HonorsBlock from './HonorsBlock';
import InternshipsBlock from './InternshipsBlock';
import CertificationsBlock from './CertificationsBlock';
import ExamInfoBlock from './ExamInfoBlock';

/** 区块 ID 与预览组件的映射，便于按模板顺序渲染 */
export const BLOCK_COMPONENTS = {
  [BLOCK_IDS.BASIC_INFO]: BasicInfoBlock,
  [BLOCK_IDS.SUMMARY]: SummaryBlock,
  [BLOCK_IDS.SKILLS]: SkillsBlock,
  [BLOCK_IDS.EXPERIENCE]: ExperienceBlock,
  [BLOCK_IDS.EDUCATION]: EducationBlock,
  [BLOCK_IDS.HONORS]: HonorsBlock,
  [BLOCK_IDS.INTERNSHIPS]: InternshipsBlock,
  [BLOCK_IDS.CERTIFICATIONS]: CertificationsBlock,
  [BLOCK_IDS.EXAM_INFO]: ExamInfoBlock,
};

export { BasicInfoBlock, SummaryBlock, SkillsBlock, ExperienceBlock, EducationBlock, HonorsBlock, InternshipsBlock, CertificationsBlock, ExamInfoBlock };
