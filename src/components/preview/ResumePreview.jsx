import React from 'react';
import { useTranslation } from 'react-i18next';
import { BLOCK_COMPONENTS } from './blocks';
import { BLOCK_IDS } from '../../config/templates';
import { TEMPLATES, LAYOUT_TYPES, ACCENT_COLORS } from '../../config/templates';
import { getAccentConfig, accentStyle } from '../../utils/accentColor';
import SidebarInfo from './SidebarInfo';

const ResumePreview = ({ id, data, blockOrder, templateId, blockGap = 'normal', titleGap = 'normal', accentColor = 'indigo' }) => {
  const { t } = useTranslation();
  const template = TEMPLATES.find((x) => x.id === templateId);
  const isSidebar = template?.layout === LAYOUT_TYPES.SIDEBAR;
  const accent = getAccentConfig(accentColor, ACCENT_COLORS);

  const rightBlockIds = isSidebar
    ? blockOrder.filter((id) => id !== BLOCK_IDS.BASIC_INFO)
    : blockOrder;

  const BasicInfoComponent = BLOCK_COMPONENTS[BLOCK_IDS.BASIC_INFO];

  // 区块间距（区块与区块之间）
  const gapClasses = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
    loose: 'space-y-8',
  };

  // 标题间距（标题与内容之间）
  const titleGapClasses = {
    tight: 'mb-1',
    normal: 'mb-4',
    loose: 'mb-6',
    spacious: 'mb-8',
  };

  const titleGapClass = titleGapClasses[titleGap] || titleGapClasses.normal;

  return (
    <div id={id} className="print-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative text-gray-800 print:shadow-none">
      <div className="h-2 w-full" style={accentStyle(accent, 'bg')} />
      <div className={`flex min-h-0 ${isSidebar ? 'p-6 md:p-8' : 'p-10 md:p-14'}`}>
        {isSidebar && (
          <div className="w-[26%] shrink-0 pr-6 print:pr-4">
            <SidebarInfo data={data} accent={accent} />
          </div>
        )}
        <div className={isSidebar ? 'flex-1 min-w-0 pl-2' : 'w-full'}>
          {rightBlockIds.length === 0 && !isSidebar ? (
            <p className="text-gray-400 text-sm text-center py-12">
              {t('preview.emptyDefault')}
            </p>
          ) : (
            <div className={gapClasses[blockGap] || gapClasses.normal}>
              {rightBlockIds.map((blockId) => {
                const BlockComponent = BLOCK_COMPONENTS[blockId];
                if (!BlockComponent) return null;
                return <BlockComponent key={blockId} data={data} titleGap={titleGapClass} accent={accent} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
