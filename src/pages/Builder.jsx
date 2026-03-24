import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Briefcase,
  FileCheck,
  ClipboardList,
  FolderGit2,
  Check,
  Clock,
  FilePlus,
  Loader,
  Settings,
} from 'lucide-react';
import { exportToPdf, exportViaNativePrint } from '../utils/pdfExport';
import ResumePreview from '../components/preview/ResumePreview';
import LanguageSwitcher from '../components/LanguageSwitcher';
import MonthYearInput from '../components/MonthYearInput';
import SortableBlockList from '../components/SortableBlockList';
import { confirm } from '../components/useToast';
import { TEMPLATES, DEFAULT_TEMPLATE_ID, BLOCK_IDS, BLOCK_LABEL_KEYS, ACCENT_COLORS, DEFAULT_ACCENT_COLOR } from '../config/templates';
import { ACCENT_COLOR_HEX } from '../utils/accentColor';
import { PROVINCE_CODES_CN, PROVINCE_CODES_US, COUNTRIES_WITH_PROVINCES, getCitiesForProvince } from '../data/regions';
import { debounce, formatSaveTime } from '../utils/persist';

const COUNTRY_CODES = ['CN', 'US', 'GB', 'JP', 'DE', 'FR', 'SG', 'AU', 'HK', 'TW', 'OTHER'];

// localStorage 键名
const STORAGE_KEY = 'resume-builder-data';
const STORAGE_TEMPLATE_KEY = 'resume-builder-template';
const STORAGE_BLOCKS_KEY = 'resume-builder-blocks';
const STORAGE_SAVED_AT_KEY = 'resume-builder-saved-at';
const STORAGE_BLOCK_GAP_KEY = 'resume-builder-block-gap';
const STORAGE_TITLE_GAP_KEY = 'resume-builder-title-gap';
const STORAGE_ACCENT_COLOR_KEY = 'resume-builder-accent-color';

// 区块间距选项（区块与区块之间）
const BLOCK_GAP_OPTIONS = [
  { value: 'compact', labelKey: 'builder.gapCompact', rem: 0.5 },
  { value: 'normal', labelKey: 'builder.gapNormal', rem: 1 },
  { value: 'relaxed', labelKey: 'builder.gapRelaxed', rem: 1.5 },
  { value: 'loose', labelKey: 'builder.gapLoose', rem: 2 },
];

// 标题间距选项（标题与内容之间）
const TITLE_GAP_OPTIONS = [
  { value: 'tight', labelKey: 'builder.titleGapTight', rem: 0.5 },
  { value: 'normal', labelKey: 'builder.titleGapNormal', rem: 1 },
  { value: 'loose', labelKey: 'builder.titleGapLoose', rem: 1.5 },
  { value: 'spacious', labelKey: 'builder.titleGapSpacious', rem: 2 },
];

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
const defaultInternshipItem = () => ({
  company: '',
  role: '',
  date: '',
  startDate: '',
  endDate: '',
  isPresent: false,
  description: '',
});
const defaultCertificationItem = () => ({
  name: '',
  issuer: '',
  date: '',
  description: '',
});
const defaultProjectItem = () => ({
  name: '',
  role: '',
  date: '',
  startDate: '',
  endDate: '',
  isPresent: false,
  showDate: true,
  description: '',
  technologies: '',
  link: '',
});

const defaultExamInfo = () => ({
  university: '',
  major: '',
  degreeType: '', // 'professional' | 'academic'
  politics: '',
  english: '',
  course1: '',
  course2: '',
  course1Name: '',
  course2Name: '',
  totalScore: '',
});

const calculateTotalScore = (examInfo) => {
  const scores = [
    parseFloat(examInfo?.politics) || 0,
    parseFloat(examInfo?.english) || 0,
    parseFloat(examInfo?.course1) || 0,
    parseFloat(examInfo?.course2) || 0,
  ];
  const allFilled = scores.every(s => s > 0);
  if (allFilled) {
    return scores.reduce((sum, s) => sum + s, 0);
  }
  return '';
};

const initialResumeDataZh = {
  personal: {
    name: '张云帆',
    title: '高级前端工程师',
    email: 'zhang.yunfan@example.com',
    phone: '138-1234-5678',
    location: '上海市, 浦东新区',
    country: 'CN',
    province: '31',
    city: '浦东新区',
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
  projects: [
    {
      id: 1,
      name: '基于 React 的后台管理系统',
      role: '项目负责人',
      date: '2022.03 - 2022.08',
      startDate: '2022-03',
      endDate: '2022-08',
      isPresent: false,
      showDate: true,
      description: '采用 React + TypeScript + Ant Design 构建企业级后台管理系统，实现了权限管理、数据可视化和用户管理等功能。',
      technologies: 'React, TypeScript, Ant Design, Node.js, MySQL',
      link: '',
    },
  ],
  internships: [],
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
  certifications: [],
  honors: [],
  examInfo: defaultExamInfo(),
};

const initialResumeDataEn = {
  personal: {
    name: 'Alex Johnson',
    title: 'Senior Frontend Engineer',
    email: 'alex.johnson@example.com',
    phone: '+1 234-567-8900',
    location: 'New York, NY',
    country: 'US',
    province: 'NY',
    city: 'New York, NY',
    website: 'alexjohnson.dev',
    github: 'github.com/alexjohnson',
    gender: 'Male',
    age: '28',
    photo: null,
    links: [],
  },
  summary:
    'Full-stack developer focused on high-performance web applications. 5+ years with React and Node.js, strong in component libraries and front-end tooling.',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Docker', 'AWS', 'Figma'],
  experience: [
    {
      id: 1,
      company: 'Tech Innovations Inc.',
      role: 'Senior Frontend Developer',
      date: '2021.06 - Present',
      startDate: '2021-06',
      endDate: '',
      isPresent: true,
      description:
        'Led refactoring of core CRM system.\nDesigned and built an internal component library based on Ant Design, improving team velocity by 30%.',
    },
    {
      id: 2,
      company: 'Creative Digital Agency',
      role: 'Frontend Engineer',
      date: '2018.07 - 2021.05',
      startDate: '2018-07',
      endDate: '2021-05',
      isPresent: false,
      description: 'Developed high-traffic e-commerce campaign pages. Owned mobile H5 adaptation and performance optimization.',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'React-based Admin Dashboard',
      role: 'Project Lead',
      date: '2022.03 - 2022.08',
      startDate: '2022-03',
      endDate: '2022-08',
      isPresent: false,
      showDate: true,
      description: 'Built an enterprise admin dashboard using React, TypeScript, and Ant Design with role-based access, data visualization, and user management.',
      technologies: 'React, TypeScript, Ant Design, Node.js, MySQL',
      link: '',
    },
  ],
  internships: [],
  education: [
    {
      id: 1,
      school: 'State University',
      degree: 'Computer Science (B.S.)',
      date: '2014.09 - 2018.06',
      startDate: '2014-09',
      endDate: '2018-06',
      isPresent: false,
      gpa: '',
      campusExperience: '',
      courses: '',
    },
  ],
  certifications: [],
  honors: [],
  examInfo: defaultExamInfo(),
};

const getInitialResumeData = (lng) => (lng === 'en' ? initialResumeDataEn : initialResumeDataZh);

const Builder = () => {
  const { t, i18n } = useTranslation();

  // ─── 状态初始化：从 localStorage 读取或使用默认数据 ───
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // 解析失败，忽略并使用默认值
      }
    }
    return getInitialResumeData(i18n.language);
  });

  const [templateId, setTemplateId] = useState(() => {
    return localStorage.getItem(STORAGE_TEMPLATE_KEY) || DEFAULT_TEMPLATE_ID;
  });

  const [blockOrder, setBlockOrder] = useState(() => {
    const saved = localStorage.getItem(STORAGE_BLOCKS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // 解析失败，使用模板默认值
      }
    }
    const template = TEMPLATES.find((x) => x.id === (localStorage.getItem(STORAGE_TEMPLATE_KEY) || DEFAULT_TEMPLATE_ID));
    return template ? [...template.blockOrder] : TEMPLATES[0].blockOrder;
  });

  // 区块间距设置
  const [blockGap, setBlockGap] = useState(() => {
    return localStorage.getItem(STORAGE_BLOCK_GAP_KEY) || 'normal';
  });

  // 标题间距设置
  const [titleGap, setTitleGap] = useState(() => {
    return localStorage.getItem(STORAGE_TITLE_GAP_KEY) || 'normal';
  });

  // 主题色设置
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem(STORAGE_ACCENT_COLOR_KEY) || DEFAULT_ACCENT_COLOR;
  });

  // 设置面板折叠状态
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);

  // ─── 保存状态 ───
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [lastSavedAt, setLastSavedAt] = useState(() => {
    const savedAt = localStorage.getItem(STORAGE_SAVED_AT_KEY);
    return savedAt ? parseInt(savedAt, 10) : null;
  });
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPos, setBlockMenuPos] = useState({ top: 0, left: 0 });
  const addBlockBtnRef = useRef(null);
  const blockMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  const basicInfoRef = useRef(null);
  const summaryRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const internshipsRef = useRef(null);
  const educationRef = useRef(null);
  const certificationsRef = useRef(null);
  const examInfoRef = useRef(null);
  const skillsRef = useRef(null);
  const honorsRef = useRef(null);

  const sectionRefMap = {
    basicInfo: basicInfoRef,
    summary: summaryRef,
    skills: skillsRef,
    experience: experienceRef,
    projects: projectsRef,
    internships: internshipsRef,
    education: educationRef,
    certifications: certificationsRef,
    examInfo: examInfoRef,
    honors: honorsRef,
  };

  const scrollToSection = (id) => {
    const ref = sectionRefMap[id];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ─── 自动保存 ───
  const saveToStorage = useCallback((data, template, blocks, gap, titleGapVal, accentColorVal) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_TEMPLATE_KEY, template);
      localStorage.setItem(STORAGE_BLOCKS_KEY, JSON.stringify(blocks));
      if (gap) localStorage.setItem(STORAGE_BLOCK_GAP_KEY, gap);
      if (titleGapVal) localStorage.setItem(STORAGE_TITLE_GAP_KEY, titleGapVal);
      if (accentColorVal) localStorage.setItem(STORAGE_ACCENT_COLOR_KEY, accentColorVal);
      const now = Date.now();
      localStorage.setItem(STORAGE_SAVED_AT_KEY, now.toString());
      setLastSavedAt(now);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, []);

  const debouncedSave = useMemo(
    () => debounce((data, template, blocks, gap, titleGapVal, accentColorVal) => {
      saveToStorage(data, template, blocks, gap, titleGapVal, accentColorVal);
      setSaveStatus('saved');
    }, 800),
    [saveToStorage]
  );

  useEffect(() => {
    setSaveStatus('saving');
    debouncedSave(resumeData, templateId, blockOrder, blockGap, titleGap, accentColor);
  }, [resumeData, templateId, blockOrder, blockGap, titleGap, accentColor, debouncedSave]);

  // 语言切换时，重新加载对应语言的默认数据（仅当没有保存数据时）
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setResumeData(getInitialResumeData(i18n.language));
    }
  }, [i18n.language]);

  // 点击空白处关闭添加区块下拉菜单
  useEffect(() => {
    if (!showBlockMenu) return;
    const handleClick = (e) => {
      if (
        !addBlockBtnRef.current?.contains(e.target) &&
        !blockMenuRef.current?.contains(e.target)
      ) {
        setShowBlockMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showBlockMenu]);

  // ─── 新建简历 ───
  const handleNewResume = useCallback(async () => {
    const confirmed = await confirm(t('builder.newResumeConfirm'), {
      confirmText: t('toast.confirm'),
      cancelText: t('toast.cancel'),
    });
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TEMPLATE_KEY);
    localStorage.removeItem(STORAGE_BLOCKS_KEY);
    localStorage.removeItem(STORAGE_SAVED_AT_KEY);
    localStorage.removeItem(STORAGE_BLOCK_GAP_KEY);
    localStorage.removeItem(STORAGE_TITLE_GAP_KEY);
    localStorage.removeItem(STORAGE_ACCENT_COLOR_KEY);
    const defaultTemplate = TEMPLATES.find((x) => x.id === DEFAULT_TEMPLATE_ID);
    setResumeData(getInitialResumeData(i18n.language));
    setTemplateId(DEFAULT_TEMPLATE_ID);
    setBlockOrder(defaultTemplate ? [...defaultTemplate.blockOrder] : TEMPLATES[0].blockOrder);
    setBlockGap('normal');
    setTitleGap('normal');
    setAccentColor(DEFAULT_ACCENT_COLOR);
    setLastSavedAt(null);
    setSaveStatus('idle');
  }, [i18n.language, t]);

  // ─── PDF 导出 ───
  // 单独的 loading 状态，避免与自动保存状态混淆
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportPdf = useCallback(() => {
    setShowExportMenu(false);
    // 取消当前 pending 的自动保存，改为同步立即保存
    debouncedSave.cancel();
    saveToStorage(resumeData, templateId, blockOrder, blockGap, titleGap, accentColor);

    setIsExporting(true);

    // 等待 DOM 更新（确保预览区已渲染）
    setTimeout(() => {
      const filename = `${resumeData.personal.name || 'resume'}_resume`;

      exportToPdf(
        '#resume-print-target',
        filename,
        () => {
          setIsExporting(false);
          setSaveStatus('saved');
        },
        () => {
          // fallback 到原生打印后也恢复状态
          setIsExporting(false);
          setSaveStatus('saved');
        }
      );
    }, 200);
  }, [resumeData, templateId, blockOrder, blockGap, titleGap, accentColor, debouncedSave, saveToStorage]);

  const handleNativePrint = useCallback(() => {
    setShowExportMenu(false);
    debouncedSave.cancel();
    saveToStorage(resumeData, templateId, blockOrder, blockGap, titleGap, accentColor);

    setIsExporting(true);
    setTimeout(() => {
      exportViaNativePrint(() => {
        setIsExporting(false);
        setSaveStatus('saved');
      });
    }, 200);
  }, [resumeData, templateId, blockOrder, blockGap, titleGap, accentColor, debouncedSave, saveToStorage]);

  const handleTemplateChange = (id) => {
    setTemplateId(id);
    localStorage.setItem(STORAGE_TEMPLATE_KEY, id);
    const template = TEMPLATES.find((x) => x.id === id);
    if (template) setBlockOrder([...template.blockOrder]);
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
    const skillsArray = e.target.value
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
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

  const handleExamInfoChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      examInfo: { ...(prev.examInfo || defaultExamInfo()), [field]: value },
    }));
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
        {/* 顶部导航栏 - 始终固定 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-20 px-4 py-3 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-gray-600" title={t('nav.backHome')}>
              <Home size={20} />
            </Link>
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
              <Layout size={20} /> {t('builder.title')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* 保存状态指示 */}
            <div className="flex items-center gap-1 text-xs text-gray-400" title={t('builder.saveStatus')}>
              {saveStatus === 'saving' && (
                <>
                  <Loader size={12} className="animate-spin" />
                  <span>{t('builder.saving')}</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check size={12} className="text-green-500" />
                  <span>{lastSavedAt ? t('builder.lastSaved') + ' ' + formatSaveTime(lastSavedAt, i18n.language) : t('builder.saved')}</span>
                </>
              )}
              {saveStatus === 'idle' && lastSavedAt === null && (
                <>
                  <Clock size={12} />
                  <span>{t('builder.noSavedData')}</span>
                </>
              )}
            </div>
            <LanguageSwitcher className="!border-gray-200" />
            {/* 新建简历 */}
            <button
              onClick={handleNewResume}
              className="text-gray-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={t('builder.newResume')}
            >
              <FilePlus size={16} />
            </button>
            {/* 导出 PDF */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu((v) => !v)}
                disabled={isExporting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                {isExporting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>{t('builder.exportingPdf')}</span>
                  </>
                ) : (
                  <>
                    <Printer size={16} />
                    <span>{t('nav.exportPdf')}</span>
                    <ChevronDown size={14} className={showExportMenu ? 'rotate-180' : ''} />
                  </>
                )}
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[180px]">
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                  >
                    <Printer size={14} />
                    {t('builder.exportPdfLibrary')}
                  </button>
                  <button
                    type="button"
                    onClick={handleNativePrint}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                  >
                    <FileCheck size={14} />
                    {t('builder.exportNativePrint')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 可折叠的设置面板 */}
        <div className="border-b border-gray-200">
          {/* 折叠/展开触发器 */}
          <button
            type="button"
            onClick={() => setSettingsCollapsed((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Settings size={14} />
              {t('builder.resumeSettings')}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${settingsCollapsed ? '' : 'rotate-180'}`}
            />
          </button>

          {/* 设置内容 */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              settingsCollapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'
            }`}
          >
            <div className="px-4 pb-4 space-y-4">

              {/* 模板选择 */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Layers size={14} /> {t('builder.selectTemplate')}
                </label>
                <div className="flex gap-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl.id)}
                      className={`flex-1 text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                        templateId === tmpl.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {t(tmpl.nameKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 区块间距 */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  {t('builder.blockGap')}
                </label>
                <div className="flex gap-2">
                  {BLOCK_GAP_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBlockGap(opt.value)}
                      className={`flex-1 text-center px-2 py-2 rounded-lg border text-xs transition-colors ${
                        blockGap === opt.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      title={`${opt.rem}rem`}
                    >
                      {t(opt.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 标题间距 */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  {t('builder.titleGap')}
                </label>
                <div className="flex gap-2">
                  {TITLE_GAP_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTitleGap(opt.value)}
                      className={`flex-1 text-center px-2 py-2 rounded-lg border text-xs transition-colors ${
                        titleGap === opt.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      title={`${opt.rem}rem`}
                    >
                      {t(opt.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 主题色 */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  {t('builder.accentColor')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentColor(c.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        accentColor === c.id
                          ? 'border-gray-800 scale-110 shadow-md'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: ACCENT_COLOR_HEX[c.id] }}
                      title={t(c.nameKey)}
                    />
                  ))}
                </div>
              </div>

              {/* 简历区块 */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  {t('builder.resumeBlocks')}
                </label>
                <SortableBlockList
                  blockOrder={blockOrder}
                  setBlockOrder={setBlockOrder}
                  getLabel={(id) => t(BLOCK_LABEL_KEYS[id])}
                  onRemove={removeBlock}
                  onClick={scrollToSection}
                  t={t}
                />
                <button
                  type="button"
                  ref={addBlockBtnRef}
                  onClick={() => {
                    if (!showBlockMenu && addBlockBtnRef.current) {
                      const rect = addBlockBtnRef.current.getBoundingClientRect();
                      setBlockMenuPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
                    }
                    setShowBlockMenu(!showBlockMenu);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors mt-2"
                >
                  <Plus size={16} /> {t('builder.addBlock')}
                  <ChevronDown size={14} className={showBlockMenu ? 'rotate-180' : ''} />
                </button>
                {showBlockMenu && availableBlocksToAdd.length > 0 && createPortal(
                  <div
                    ref={blockMenuRef}
                    className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1"
                    style={{ top: blockMenuPos.top, left: blockMenuPos.left, minWidth: 180 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {availableBlocksToAdd.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => addBlock(id)}
                        className="w-full text-left inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-md text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors mx-1 mt-1 first:mt-0"
                        style={{ display: 'flex', width: 'calc(100% - 8px)' }}
                      >
                        {t(BLOCK_LABEL_KEYS[id])}
                      </button>
                    ))}
                  </div>,
                  document.body
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 编辑区域 */}
        <div className="p-6 space-y-8 pb-20 text-sm">
          <section ref={basicInfoRef} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> {t('builder.basicInfo')}
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
                    <span className="text-[10px] mt-1 text-gray-500">{t('builder.uploadPhoto')}</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              <span className="text-xs text-gray-500">{t('builder.photoHint')}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder={t('builder.name')} value={resumeData.personal.name} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
              <input name="title" placeholder={t('builder.jobTitle')} value={resumeData.personal.title} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select name="gender" value={resumeData.personal.gender} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="男">{t('builder.male')}</option>
                <option value="女">{t('builder.female')}</option>
                <option value="保密">{t('builder.preferNotSay')}</option>
              </select>
              <input name="age" type="number" placeholder={t('builder.age')} value={resumeData.personal.age} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <input name="email" placeholder={t('builder.email')} value={resumeData.personal.email} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <input name="phone" placeholder={t('builder.phone')} value={resumeData.personal.phone} onChange={handlePersonalChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <div className="space-y-2">
              <select
                name="country"
                value={resumeData.personal.country || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setResumeData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, country: v, province: '', city: '' },
                  }));
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                aria-label={t('builder.selectCountry')}
              >
                <option value="">{t('builder.selectCountry')}</option>
                {COUNTRY_CODES.map((code) => (
                  <option key={code} value={code}>{t(`countries.${code}`)}</option>
                ))}
              </select>
              {COUNTRIES_WITH_PROVINCES.includes(resumeData.personal.country) && (
                <select
                  name="province"
                  value={resumeData.personal.province || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    setResumeData((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, province: v, city: '' },
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                  aria-label={t('builder.selectProvince')}
                >
                  <option value="">{t('builder.selectProvince')}</option>
                  {(resumeData.personal.country === 'CN' ? PROVINCE_CODES_CN : PROVINCE_CODES_US).map((code) => (
                    <option key={code} value={code}>
                      {t(`region.${resumeData.personal.country}.${code}`)}
                    </option>
                  ))}
                </select>
              )}
              {resumeData.personal.country === 'CN' && resumeData.personal.province ? (
                (() => {
                  const cities = getCitiesForProvince(resumeData.personal.province);
                  const cityValue = resumeData.personal.city ?? '';
                  const otherOption = '其他';
                  const isOther = cityValue === otherOption || (cityValue && !cities.includes(cityValue));
                  return (
                    <div className="space-y-1">
                      <select
                        name="city"
                        value={cities.includes(cityValue) ? cityValue : otherOption}
                        onChange={(e) => {
                          const v = e.target.value;
                          setResumeData((prev) => ({
                            ...prev,
                            personal: {
                              ...prev.personal,
                              city: v === otherOption ? '' : v,
                            },
                          }));
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                        aria-label={t('builder.selectCity')}
                      >
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {isOther && (
                        <input
                          name="city"
                          placeholder={t('builder.cityPlaceholder')}
                          value={cityValue}
                          onChange={handlePersonalChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm"
                        />
                      )}
                    </div>
                  );
                })()
              ) : (
                <input
                  name="city"
                  placeholder={t('builder.cityPlaceholder')}
                  value={resumeData.personal.city ?? ''}
                  onChange={handlePersonalChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                />
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500">{t('builder.personalLinks')}</span>
                <button type="button" onClick={addLink} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                  <Plus size={12} /> {t('builder.addLink')}
                </button>
              </div>
              {links.map((link) => (
                <div key={link.id} className="flex gap-2 mb-2">
                  <input value={link.label ?? ''} onChange={(e) => updateLink(link.id, 'label', e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.linkLabelPlaceholder')} />
                  <input value={link.url ?? ''} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.linkUrlPlaceholder')} />
                  <button type="button" onClick={() => removeLink(link.id)} className="text-gray-400 hover:text-red-500 shrink-0" title={t('builder.delete')}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          <section ref={summaryRef} className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('builder.summary')}</h3>
            <textarea value={resumeData.summary} onChange={handleSummaryChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none h-32 resize-none leading-relaxed" placeholder={t('builder.summaryPlaceholder')} />
          </section>

          <section ref={skillsRef} className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('builder.skills')}</h3>
            <textarea value={resumeData.skills.join(', ')} onChange={handleSkillsChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none h-20 resize-none" placeholder={t('builder.skillsPlaceholder')} />
          </section>

          <section ref={experienceRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('builder.experience')}</h3>
              <button type="button" onClick={() => addItem('experience', defaultExperienceItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> {t('builder.add')}
              </button>
            </div>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('experience', exp.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={exp.company} onChange={(e) => updateList('experience', exp.id, 'company', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.company')} />
                  <input value={exp.role} onChange={(e) => updateList('experience', exp.id, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.role')} />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                      <span className="shrink-0">{t('builder.time')}</span>
                      <MonthYearInput value={exp.startDate ?? ''} onChange={(v) => updateList('experience', exp.id, 'startDate', v)} title={t('builder.startTime')} className="flex-1 min-w-0" />
                      <span className="text-gray-400">{t('builder.to')}</span>
                      <MonthYearInput value={exp.isPresent ? '' : (exp.endDate ?? '')} onChange={(v) => updateList('experience', exp.id, 'endDate', v)} disabled={exp.isPresent} title={t('builder.endTime')} className="flex-1 min-w-0" />
                      <label className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <input type="checkbox" checked={!!exp.isPresent} onChange={(e) => updateList('experience', exp.id, 'isPresent', e.target.checked)} className="rounded border-gray-300" />
                        {t('builder.present')}
                      </label>
                    </label>
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateList('experience', exp.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-20" placeholder={t('builder.description')} />
                </div>
              </div>
            ))}
          </section>

          <section ref={projectsRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FolderGit2 size={14} /> {t('builder.projects')}
              </h3>
              <button type="button" onClick={() => addItem('projects', defaultProjectItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> {t('builder.add')}
              </button>
            </div>
            {(resumeData.projects || []).map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('projects', item.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={item.name ?? ''} onChange={(e) => updateList('projects', item.id, 'name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.projectName')} />
                  <input value={item.role ?? ''} onChange={(e) => updateList('projects', item.id, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.projectRole')} />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                      <span className="shrink-0">{t('builder.time')}</span>
                      <MonthYearInput value={item.startDate ?? ''} onChange={(v) => updateList('projects', item.id, 'startDate', v)} title={t('builder.startTime')} className="flex-1 min-w-0" />
                      <span className="text-gray-400">{t('builder.to')}</span>
                      <MonthYearInput value={item.isPresent ? '' : (item.endDate ?? '')} onChange={(v) => updateList('projects', item.id, 'endDate', v)} disabled={item.isPresent} title={t('builder.endTime')} className="flex-1 min-w-0" />
                      <label className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <input type="checkbox" checked={!!item.isPresent} onChange={(e) => updateList('projects', item.id, 'isPresent', e.target.checked)} className="rounded border-gray-300" />
                        {t('builder.present')}
                      </label>
                    </label>
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600">
                      <input type="checkbox" checked={item.showDate !== false} onChange={(e) => updateList('projects', item.id, 'showDate', e.target.checked)} className="rounded border-gray-300" />
                      {t('builder.showDate')}
                    </label>
                  </div>
                  <input value={item.technologies ?? ''} onChange={(e) => updateList('projects', item.id, 'technologies', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.technologies')} />
                  <input value={item.link ?? ''} onChange={(e) => updateList('projects', item.id, 'link', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.projectLink')} />
                  <textarea value={item.description ?? ''} onChange={(e) => updateList('projects', item.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[80px] resize-y" placeholder={t('builder.projectDesc')} />
                </div>
              </div>
            ))}
          </section>

          <section ref={internshipsRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={14} /> {t('builder.internships')}
              </h3>
              <button type="button" onClick={() => addItem('internships', defaultInternshipItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> {t('builder.add')}
              </button>
            </div>
            {(resumeData.internships || []).map((it) => (
              <div key={it.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('internships', it.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={it.company} onChange={(e) => updateList('internships', it.id, 'company', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.company')} />
                  <input value={it.role} onChange={(e) => updateList('internships', it.id, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.role')} />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                      <span className="shrink-0">{t('builder.time')}</span>
                      <MonthYearInput value={it.startDate ?? ''} onChange={(v) => updateList('internships', it.id, 'startDate', v)} title={t('builder.startTime')} className="flex-1 min-w-0" />
                      <span className="text-gray-400">{t('builder.to')}</span>
                      <MonthYearInput value={it.isPresent ? '' : (it.endDate ?? '')} onChange={(v) => updateList('internships', it.id, 'endDate', v)} disabled={it.isPresent} title={t('builder.endTime')} className="flex-1 min-w-0" />
                      <label className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <input type="checkbox" checked={!!it.isPresent} onChange={(e) => updateList('internships', it.id, 'isPresent', e.target.checked)} className="rounded border-gray-300" />
                        {t('builder.present')}
                      </label>
                    </label>
                  </div>
                  <textarea value={it.description} onChange={(e) => updateList('internships', it.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-20" placeholder={t('builder.description')} />
                </div>
              </div>
            ))}
          </section>

          <section ref={educationRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap size={14} /> {t('builder.education')}
              </h3>
              <button type="button" onClick={() => addItem('education', defaultEducationItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> {t('builder.add')}
              </button>
            </div>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('education', edu.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={edu.school ?? ''} onChange={(e) => updateList('education', edu.id, 'school', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.school')} />
                  <input value={edu.degree ?? ''} onChange={(e) => updateList('education', edu.id, 'degree', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.degree')} />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                      <span className="shrink-0">{t('builder.time')}</span>
                      <MonthYearInput value={edu.startDate ?? ''} onChange={(v) => updateList('education', edu.id, 'startDate', v)} title={t('builder.startTime')} className="flex-1 min-w-0" />
                      <span className="text-gray-400">{t('builder.to')}</span>
                      <MonthYearInput value={edu.isPresent ? '' : (edu.endDate ?? '')} onChange={(v) => updateList('education', edu.id, 'endDate', v)} disabled={!!edu.isPresent} title={t('builder.endTime')} className="flex-1 min-w-0" />
                      <label className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <input type="checkbox" checked={!!edu.isPresent} onChange={(e) => updateList('education', edu.id, 'isPresent', e.target.checked)} className="rounded border-gray-300" />
                        {t('builder.present')}
                      </label>
                    </label>
                  </div>
                  <input value={edu.gpa ?? ''} onChange={(e) => updateList('education', edu.id, 'gpa', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.gpaPlaceholder')} />
                  <textarea value={edu.campusExperience ?? ''} onChange={(e) => updateList('education', edu.id, 'campusExperience', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[60px] resize-y" placeholder={t('builder.campusExperience')} />
                  <textarea value={edu.courses ?? ''} onChange={(e) => updateList('education', edu.id, 'courses', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[60px] resize-y" placeholder={t('builder.courses')} />
                </div>
              </div>
            ))}
          </section>

          <section ref={certificationsRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={14} /> {t('builder.certifications')}
              </h3>
              <button type="button" onClick={() => addItem('certifications', defaultCertificationItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> {t('builder.add')}
              </button>
            </div>
            {(resumeData.certifications || []).map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('certifications', item.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={item.name ?? ''} onChange={(e) => updateList('certifications', item.id, 'name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.certName')} />
                  <input value={item.issuer ?? ''} onChange={(e) => updateList('certifications', item.id, 'issuer', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.certIssuer')} />
                  <MonthYearInput value={item.date ?? ''} onChange={(v) => updateList('certifications', item.id, 'date', v)} className="w-full" title={t('builder.certTime')} />
                  <textarea value={item.description ?? ''} onChange={(e) => updateList('certifications', item.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[50px] resize-y" placeholder={t('builder.certDesc')} />
                </div>
              </div>
            ))}
          </section>

          <section ref={examInfoRef} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ClipboardList size={14} /> {t('builder.examInfo')}
            </h3>
            <div className="space-y-3">
              <input value={resumeData.examInfo?.university ?? ''} onChange={(e) => handleExamInfoChange('university', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('builder.targetUniversity')} />
              <input value={resumeData.examInfo?.major ?? ''} onChange={(e) => handleExamInfoChange('major', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('builder.targetMajor')} />
              <select value={resumeData.examInfo?.degreeType ?? ''} onChange={(e) => handleExamInfoChange('degreeType', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">{t('builder.degreeType')}</option>
                <option value="professional">{t('builder.professionalMaster')}</option>
                <option value="academic">{t('builder.academicMaster')}</option>
              </select>
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-2">{t('builder.preliminaryScores')}</div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg text-sm">
                <tbody>
                  <tr className="bg-gray-50">
                    <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-left align-middle w-24">{t('builder.preliminaryScores')}</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium">{t('builder.politics')}</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium">{t('builder.english')}</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium">{t('builder.course1')}</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium">{t('builder.course2')}</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium">{t('builder.totalScore')}</th>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-0">
                      <input type="text" inputMode="numeric" value={resumeData.examInfo?.politics ?? ''} onChange={(e) => handleExamInfoChange('politics', e.target.value)} className="w-full border-0 rounded-none px-2 py-1.5 text-center text-sm" placeholder="—" />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input type="text" inputMode="numeric" value={resumeData.examInfo?.english ?? ''} onChange={(e) => handleExamInfoChange('english', e.target.value)} className="w-full border-0 rounded-none px-2 py-1.5 text-center text-sm" placeholder="—" />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input type="text" inputMode="numeric" value={resumeData.examInfo?.course1 ?? ''} onChange={(e) => handleExamInfoChange('course1', e.target.value)} className="w-full border-0 rounded-none px-2 py-1.5 text-center text-sm" placeholder="—" />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input type="text" inputMode="numeric" value={resumeData.examInfo?.course2 ?? ''} onChange={(e) => handleExamInfoChange('course2', e.target.value)} className="w-full border-0 rounded-none px-2 py-1.5 text-center text-sm" placeholder="—" />
                    </td>
                    <td className="border border-gray-300 p-0 bg-gray-50">
                      <div className="w-full border-0 rounded-none px-2 py-1.5 text-center text-sm font-semibold text-indigo-700">
                        {(() => {
                          const total = calculateTotalScore(resumeData.examInfo);
                          return total !== '' ? total : '—';
                        })()}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={resumeData.examInfo?.course1Name ?? ''} onChange={(e) => handleExamInfoChange('course1Name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.course1Remark')} />
              <input value={resumeData.examInfo?.course2Name ?? ''} onChange={(e) => handleExamInfoChange('course2Name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.course2Remark')} />
            </div>
          </section>

          <section ref={honorsRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Award size={14} /> {t('builder.honors')}
              </h3>
              <button type="button" onClick={() => addItem('honors', defaultHonorsItem())} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> {t('builder.add')}
              </button>
            </div>
            {resumeData.honors.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeItem('honors', item.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-8">
                  <input value={item.title ?? ''} onChange={(e) => updateList('honors', item.id, 'title', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder={t('builder.awardName')} />
                  <MonthYearInput value={item.date ?? ''} onChange={(v) => updateList('honors', item.id, 'date', v)} className="w-full" title={t('builder.awardTime')} />
                  <textarea value={item.description ?? ''} onChange={(e) => updateList('honors', item.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm min-h-[50px] resize-y" placeholder={t('builder.awardDesc')} />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* 右侧预览：按区块顺序渲染 */}
      <div className="flex-1 bg-gray-500 overflow-y-auto p-4 md:p-12 print:p-0 print:bg-white flex justify-center items-start">
        <ResumePreview id="resume-print-target" data={resumeData} blockOrder={blockOrder} templateId={templateId} blockGap={blockGap} titleGap={titleGap} accentColor={accentColor} />
      </div>
    </div>
  );
};

export default Builder;
