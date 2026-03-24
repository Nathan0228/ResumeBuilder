import React from 'react';
import { useTranslation } from 'react-i18next';
import { accentStyle } from '../../../utils/accentColor';

const SkillsBlock = ({ data, titleGap = 'mb-4', accent }) => {
  const { t } = useTranslation();
  const { skills } = data;
  if (!skills?.length) return null;
  return (
    <section>
      <h3 className={`text-xs font-bold text-gray-900 uppercase tracking-[0.2em] ${titleGap} border-l-4 pl-3`} style={accentStyle(accent, 'borderColor')}>
        {t('blocks.skills')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="bg-gray-100 px-3 py-1 rounded-full text-[11px] font-bold text-gray-600 border border-gray-200"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
};

export default SkillsBlock;
