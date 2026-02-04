import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, User, ArrowRight } from 'lucide-react';

const Footer = ({ variant = 'default' }) => {
  const isMinimal = variant === 'minimal';

  return (
    <footer className="border-t border-slate-200/80 bg-white/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <FileText size={16} />
              首页
            </Link>
            <Link
              to="/builder"
              className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <ArrowRight size={16} />
              制作简历
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <User size={16} />
              关于作者
            </Link>
          </div>
          {!isMinimal && (
            <p className="text-xs text-slate-400">
              选择模板 · 编辑区块 · 导出 PDF
            </p>
          )}
        </div>
        <p className="mt-3 text-center sm:text-left text-xs text-slate-400">
          © {new Date().getFullYear()} 简历制作 · 仅供学习与个人使用
        </p>
      </div>
    </footer>
  );
};

export default Footer;
