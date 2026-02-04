import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Printer,
  Layout,
  Type,
  Camera,
  GraduationCap,
  Award,
  Layers,
  ChevronDown,
  Home,
} from 'lucide-react';
import ResumePreview from '../components/preview/ResumePreview';
import { TEMPLATES, DEFAULT_TEMPLATE_ID, BLOCK_IDS, BLOCK_LABELS } from '../config/templates';

const defaultEducationItem = () => ({
  school: '',
  degree: '',
  date: '',
  startDate: '',
  endDate: '',
  isPresent: false,
  gpa: '',
  campusExperience: '',
  courses: '',
});
const defaultExperienceItem = () => ({
  company: '',
  role: '',
  date: '',
  startDate: '',
  endDate: '',
  isPresent: false,
  description: '',
});
const defaultHonorsItem = () => ({
  title: '',
  date: '',
  description: '',
});

const initialResumeData = {
  personal: {
    name: '张云帆',
    title: '高级前端工程师',
    email: 'zhang.yunfan@example.com',
    phone: '138-1234-5678',
    location: '上海市, 浦东新区',
    website: 'zhang-dev.io',
    github: 'github.com/zhangyunfan',
    gender: '男',
    age: '28',
    photo: null,
    links: [],
  },
  summary:
    '热衷于构建高性能 Web 应用的全栈开发者。拥有 5 年 React 和 Node.js 开发经验，擅长组件库设计与前端工程化。',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Docker', 'AWS', 'Figma'],
  experience: [
    {
      id: 1,
      company: '未来科技有限公司',
      role: '高级前端开发',
      date: '2021.06 - 至今',
      startDate: '2021-06',
      endDate: '',
      isPresent: true,
      description:
        '负责公司核心 CRM 系统的重构与维护。\n设计并实现了一套基于 Ant Design 的内部组件库，提升团队开发效率 30%。',
    },
    {
      id: 2,
      company: '创意互动网络',
      role: '前端工程师',
      date: '2018.07 - 2021.05',
      startDate: '2018-07',
      endDate: '2021-05',
      isPresent: false,
      description: '参与多个大型电商活动页面的开发，抗住千万级 PV 流量。\n负责移动端 H5 适配与性能优化。',
    },
  ],
  education: [
    {
      id: 1,
      school: '上海交通大学',
      degree: '计算机科学与技术 (本科)',
      date: '2014.09 - 2018.06',
      startDate: '2014-09',
      endDate: '2018-06',
      isPresent: false,
      gpa: '',
      campusExperience: '',
      courses: '',
    },
  ],
  honors: [],
};

const Builder = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [blockOrder, setBlockOrder] = useState(() => {
    const t = TEMPLATES.find((x) => x.id === DEFAULT_TEMPLATE_ID);
    return t ? [...t.blockOrder] : TEMPLATES[0].blockOrder;
  });
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const fileInputRef = useRef(null);

  const handleTemplateChange = (id) => {
    setTemplateId(id);
    const t = TEMPLATES.find((x) => x.id === id);
    if (t) setBlockOrder([...t.blockOrder]);
  };

  const addBlock = (blockId) => {
    if (blockOrder.includes(blockId)) return;
    setBlockOrder([...blockOrder, blockId]);
    setShowBlockMenu(false);
  };

  const removeBlock = (blockId) => {
    setBlockOrder(blockOrder.filter((id) => id !== blockId));
  };

  const availableBlocksToAdd = useMemo(
    () => Object.values(BLOCK_IDS).filter((id) => !blockOrder.includes(id)),
    [blockOrder]
  );

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [name]: value },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData((prev) => ({
          ...prev,
          personal: { ...prev.personal, photo: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const links = resumeData.personal.links || [];
  const addLink = () => {
    setResumeData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: [...(prev.personal.links || []), { id: Date.now(), label: '', url: '' }],
      },
    }));
  };
  const removeLink = (id) => {
    setResumeData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: (prev.personal.links || []).filter((l) => l.id !== id),
      },
    }));
  };
  const updateLink = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: (prev.personal.links || []).map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      },
    }));
  };

  const handleSummaryChange = (e) => {
    setResumeData((prev) => ({ ...prev, summary: e.target.value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map((s) => s.trim());
    setResumeData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const updateList = (section, id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = (section, template) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...template, id: Date.now() }],
    }));
  };

  const removeItem = (section, id) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans text-gray-800">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; margin: 0; padding: 0; }
            .print-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
            @page { size: A4; margin: 0; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      {/* 左侧编辑器 */}
      <div className="no-print w-full md:w-[450px] bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col shadow-xl z-20">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 z-10 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-gray-400 hover:text-gray-600" title="返回首页">
                <Home size={20} />
              </Link>
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
                <Layout size={20} /> 简历编辑器
              </h2>
            </div>
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer size={16} /> 导出 PDF
            </button>
          </div>

          {/* 选择模板 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Layers size={14} /> 选择模板
            </label>
            <div className="flex gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTemplateChange(t.id)}
                  className={`flex-1 text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    templateId === t.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* 添加 / 管理区块 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              简历区块
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {blockOrder.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs"
                >
                  {BLOCK_LABELS[id]}
                  <button
                    type="button"
                    onClick={() => removeBlock(id)}
                    className="text-gray-400 hover:text-red-500 ml-0.5"
                    title="移除区块"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBlockMenu(!showBlockMenu)}
                className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <Plus size={16} /> 添加区块
                <ChevronDown size={14} className={showBlockMenu ? 'rotate-180' : ''} />
              </button>
              {showBlockMenu && availableBlocksToAdd.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                  {availableBlocksToAdd.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => addBlock(id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {BLOCK_LABELS[id]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 pb-20 text-sm">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> 基本资料
            </h3>
            <div
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-24 bg-gray-200 rounded border border-gray-300 flex flex-col items-center justify-center overflow-hidden shrink-0">
                {resumeData.personal.photo ? (
                  <img src={resumeData.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={20} className="text-gray-500" />
                    <span className="text-[10px] mt-1 text-gray-500">上传照片</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              <span className="text-xs text-gray-500">支持 JPG/PNG，建议 3:4</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="姓名" value={resumeData.personal.name} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
              <input name="title" placeholder="职位头衔" value={resumeData.personal.title} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select name="gender" value={resumeData.personal.gender} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="保密">保密</option>
              </select>
              <input name="age" type="number" placeholder="年龄" value={resumeData.personal.age} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <input name="email" placeholder="邮箱" value={resumeData.personal.email} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <input name="phone" placeholder="电话" value={resumeData.personal.phone} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <input name="location" placeholder="地址" value={resumeData.personal.location} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500">个人链接</span>
                <button type="button" onClick={addLink} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                  <Plus size={12} /> 添加链接
                </button>
              </div>
              {links.map((link) => (
                <div key={link.id} className="flex gap-2 mb-2">
                  <input value={link.label ?? ''} onChange={(e) => updateLink(link.id, 'label', e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="名称 如 GitHub" />
                  <input value={link.url ?? ''} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="URL" />
                  <button type="button" onClick={() => removeLink(link.id)} className="text-gray-400 hover:text-red-500 shrink-0" title="删除">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">个人评价</h3>
            <textarea value={resumeData.summary} onChange={handleSummaryChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none h-32 resize-none leading-relaxed" placeholder="核心优势..." />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">技能清单</h3>
            <textarea value={resumeData.skills.join(', ')} onChange={handleSkillsChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none h-20 resize-none" placeholder="用逗号分隔..." />
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">工作经历</h3>
              <button type="button" onClick={() => addItem('experience', defaultExperienceItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> 添加
              </button>
            </div>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('experience', exp.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={exp.company} onChange={(e) => updateList('experience', exp.id, 'company', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="公司" />
                  <input value={exp.role} onChange={(e) => updateList('experience', exp.id, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="职位" />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600">
                      <span className="shrink-0">时间</span>
                      <input type="month" value={exp.startDate ?? ''} onChange={(e) => updateList('experience', exp.id, 'startDate', e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" title="开始时间" />
                      <span className="text-gray-400">至</span>
                      <input type="month" value={exp.isPresent ? '' : (exp.endDate ?? '')} onChange={(e) => updateList('experience', exp.id, 'endDate', e.target.value)} disabled={exp.isPresent} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400" title="结束时间" />
                      <label className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <input type="checkbox" checked={!!exp.isPresent} onChange={(e) => updateList('experience', exp.id, 'isPresent', e.target.checked)} className="rounded border-gray-300" />
                        至今
                      </label>
                    </label>
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateList('experience', exp.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-20" placeholder="描述" />
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap size={14} /> 教育背景
              </h3>
              <button type="button" onClick={() => addItem('education', defaultEducationItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> 添加
              </button>
            </div>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('education', edu.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={edu.school ?? ''} onChange={(e) => updateList('education', edu.id, 'school', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="学校" />
                  <input value={edu.degree ?? ''} onChange={(e) => updateList('education', edu.id, 'degree', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="专业/学历" />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                      <span className="shrink-0">时间</span>
                      <input type="month" value={edu.startDate ?? ''} onChange={(e) => updateList('education', edu.id, 'startDate', e.target.value)} className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-sm" title="开始时间" />
                      <span className="text-gray-400">至</span>
                      <input type="month" value={edu.isPresent ? '' : (edu.endDate ?? '')} onChange={(e) => updateList('education', edu.id, 'endDate', e.target.value)} disabled={!!edu.isPresent} className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400" title="结束时间" />
                      <label className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <input type="checkbox" checked={!!edu.isPresent} onChange={(e) => updateList('education', edu.id, 'isPresent', e.target.checked)} className="rounded border-gray-300" />
                        至今
                      </label>
                    </label>
                  </div>
                  <input value={edu.gpa ?? ''} onChange={(e) => updateList('education', edu.id, 'gpa', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="GPA 如 3.8/4.0" />
                  <textarea value={edu.campusExperience ?? ''} onChange={(e) => updateList('education', edu.id, 'campusExperience', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[60px] resize-y" placeholder="校内经历（社团、竞赛、项目等）" />
                  <textarea value={edu.courses ?? ''} onChange={(e) => updateList('education', edu.id, 'courses', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[60px] resize-y" placeholder="所修课程（每行一门或逗号分隔）" />
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Award size={14} /> 荣誉奖项
              </h3>
              <button type="button" onClick={() => addItem('honors', defaultHonorsItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> 添加
              </button>
            </div>
            {resumeData.honors.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('honors', item.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={item.title ?? ''} onChange={(e) => updateList('honors', item.id, 'title', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="奖项名称" />
                  <input type="month" value={item.date ?? ''} onChange={(e) => updateList('honors', item.id, 'date', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="获奖时间" title="获奖时间" />
                  <textarea value={item.description ?? ''} onChange={(e) => updateList('honors', item.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[50px] resize-y" placeholder="简要说明（可选）" />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* 右侧预览：按区块顺序渲染 */}
      <div className="flex-1 bg-gray-500 overflow-y-auto p-4 md:p-12 print:p-0 print:bg-white flex justify-center items-start">
        <ResumePreview data={resumeData} blockOrder={blockOrder} templateId={templateId} />
      </div>
    </div>
  );
};

export default Builder;
