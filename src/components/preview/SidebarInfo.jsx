import React from 'react';
import { Mail, Phone, MapPin, UserCircle, Link as LinkIcon } from 'lucide-react';

/**
 * GitHub 风格：左侧栏 - 个人信息 + 链接列表
 * 占比约 1/4，用于 sidebar 布局
 */
const SidebarInfo = ({ data }) => {
  const { personal } = data;
  const links = personal.links || [];

  return (
    <aside className="w-full flex flex-col border-r border-gray-200 pr-4 print:pr-2">
      {/* 头像 */}
      {personal.photo && (
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 mb-4 mx-auto">
          <img src={personal.photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <h1 className="text-lg font-bold text-gray-900 mb-0.5 leading-tight">
        {personal.name}
      </h1>
      <p className="text-sm text-gray-600 mb-4">{personal.title}</p>

      {/* 联系方式 */}
      <div className="space-y-2 text-xs text-gray-600 mb-4">
        {personal.email && (
          <a href={`mailto:${personal.email}`} className="flex items-center gap-2 hover:text-indigo-600 break-all">
            <Mail size={12} className="shrink-0 text-gray-400" />
            {personal.email}
          </a>
        )}
        {personal.phone && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="shrink-0 text-gray-400" />
            {personal.phone}
          </div>
        )}
        {personal.location && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0 text-gray-400" />
            {personal.location}
          </div>
        )}
        {personal.gender && (
          <div className="flex items-center gap-2">
            <UserCircle size={12} className="shrink-0 text-gray-400" />
            {personal.gender}
            {personal.age ? ` / ${personal.age}岁` : ''}
          </div>
        )}
      </div>

      {/* 个人链接 */}
      {links.length > 0 && (
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <LinkIcon size={10} /> 链接
          </div>
          <ul className="space-y-1.5">
            {links.filter((l) => l.label || l.url).map((link) => (
              <li key={link.id}>
                <a
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline break-all"
                >
                  {link.label || link.url || '链接'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default SidebarInfo;
