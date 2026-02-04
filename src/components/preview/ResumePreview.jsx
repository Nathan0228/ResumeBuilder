import React from 'react';
import { BLOCK_COMPONENTS } from './blocks';
import { TEMPLATES, LAYOUT_TYPES } from '../../config/templates';
import { BLOCK_IDS } from '../../config/templates';
import SidebarInfo from './SidebarInfo';

/**
 * 根据模板的区块顺序与布局渲染简历预览
 * @param {Object} data - resumeData
 * @param {string[]} blockOrder - 区块 ID 顺序
 * @param {string} templateId - 当前模板 id，用于判断是否使用 sidebar 布局
 */
const ResumePreview = ({ data, blockOrder, templateId }) => {
  const template = TEMPLATES.find((t) => t.id === templateId);
  const isSidebar = template?.layout === LAYOUT_TYPES.SIDEBAR;

  const rightBlockIds = isSidebar
    ? blockOrder.filter((id) => id !== BLOCK_IDS.BASIC_INFO)
    : blockOrder;

  return (
    <div className="print-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative text-gray-800 print:shadow-none">
      <div className="h-2 w-full bg-indigo-600" />
      <div className={`flex min-h-0 ${isSidebar ? 'p-6 md:p-8' : 'p-10 md:p-14'}`}>
        {isSidebar && (
          <div className="w-[26%] shrink-0 pr-6 print:pr-4">
            <SidebarInfo data={data} />
          </div>
        )}
        <div className={isSidebar ? 'flex-1 min-w-0 pl-2' : 'w-full'}>
          {rightBlockIds.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">
              {isSidebar ? '在左侧编辑区添加区块，内容将显示于本栏' : '在左侧「添加区块」中选择要显示的简历区块'}
            </p>
          ) : (
            <div className="space-y-8">
              {rightBlockIds.map((blockId) => {
                const BlockComponent = BLOCK_COMPONENTS[blockId];
                if (!BlockComponent) return null;
                return <BlockComponent key={blockId} data={data} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
