import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateRange } from '../../../utils/dateFormat';

const InternshipsBlock = ({ data }) => {
  const { t } = useTranslation();
  const { internships } = data;
  if (!internships?.length) return null;

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-indigo-600 pl-3">
        {t('blocks.internships')}
      </h3>
      <div className="space-y-8">
        {internships.map((it) => (
          <div key={it.id}>
            <div className="flex justify-between items-baseline font-bold text-gray-900 mb-1">
              <span className="text-base">{it.company}</span>
              <span className="text-xs text-gray-500 font-mono">
                {formatDateRange(it.startDate, it.endDate, it.isPresent, it.date, t('builder.present'))}
              </span>
            </div>
            <div className="text-indigo-600 text-xs font-bold mb-3 uppercase tracking-wide">
              {it.role}
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line border-l border-gray-100 pl-4">
              {it.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InternshipsBlock;
