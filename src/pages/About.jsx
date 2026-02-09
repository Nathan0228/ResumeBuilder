import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FileText, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import aboutZh from '../content/about.zh.md?raw';
import aboutEn from '../content/about.en.md?raw';
import wechatImg from '../assets/wechat.JPG';
import alipayImg from '../assets/alipay.JPG';

const SUPPORT_IMAGES = {
  '/src/assets/wechat.JPG': wechatImg,
  '/src/assets/alipay.JPG': alipayImg,
  'src/assets/wechat.JPG': wechatImg,
  'src/assets/alipay.JPG': alipayImg,
};

const About = () => {
  const { t, i18n } = useTranslation();
  const aboutContent = i18n.language === 'en' ? aboutEn : aboutZh;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      <header className="px-6 py-5 border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={18} /> {t('nav.backHome')}
          </Link>
          <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-indigo-600" size={22} />
            {t('about.pageTitle')}
          </span>
          <Link
            to="/builder"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {t('nav.buildResume')}
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <article className="markdown-content">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt, ...props }) => (
                <img
                  src={SUPPORT_IMAGES[src] || src}
                  alt={alt ?? ''}
                  {...props}
                  className="support-qr"
                />
              ),
            }}
          >
            {aboutContent}
          </ReactMarkdown>
        </article>
      </main>

      <Footer variant="minimal" />
    </div>
  );
};

export default About;
