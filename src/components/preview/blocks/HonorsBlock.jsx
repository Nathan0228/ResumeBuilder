import React from 'react';
import { useTranslation } from 'react-i18next';
import { monthToDisplay } from '../../../utils/dateFormat';
import { accentStyle } from '../../../utils/accentColor';

const HonorsBlock = ({ data, titleGap = 'mb-6', accent }) => {
  const { t } = useTranslation();
  const { honors } = data;
  if (!honors?.length) return null;
  return (
    <section>
      <h3 className={`text-xs font-bold text-gray-900 uppercase tracking-[0.2em] ${titleGap} border-l-4 pl-3`} style={accentStyle(accent, 'borderColor')}>
        {t('blocks.honors')}
      </h3>
      <div className="space-y-2">
        {honors.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-4">
            <div>
              <div className=" text-[13px] ">{item.title}</div>
              {item.description && (
                <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line mt-0.5">
                  ——{item.description}
                </p>
              )}
            </div>
            {item.date && (
              <span className="text-xs text-gray-500 font-mono shrink-0">
                {item.date.includes('-') ? monthToDisplay(item.date) : item.date}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HonorsBlock;
