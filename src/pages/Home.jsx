import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

//使用import引用图片，方可在生产环境正常显示
import mordenImg from '../assets/morden.png';
import classicalImg from '../assets/classical.png';
import githubImg from '../assets/github.png';
import findingthemeImg from '../assets/findingtheme.png';

const TYPE_INTERVAL = 120;

/** 替换为你的模板样图路径，例如 '/templates/modern.png'；留空则显示占位 */
const TEMPLATE_IMAGE_1 = mordenImg; // 现代风格
const TEMPLATE_IMAGE_2 = classicalImg; //经典风格
const TEMPLATE_IMAGE_3 = githubImg; //GitHub 风格
const TEMPLATE_IMAGE_4 = findingthemeImg; //finding your dream jb
/** 打字机效果：逐字显示文案（用 key 让语言切换时重新开始） */
const TypewriterTitle = () => {
  const { t } = useTranslation();
  const titleFull = t('home.title');
  const [text, setText] = useState('');

  useEffect(() => {
    if (text.length >= titleFull.length) return;
    const timer = setTimeout(() => {
      setText(titleFull.slice(0, text.length + 1));
    }, TYPE_INTERVAL);
    return () => clearTimeout(timer);
  }, [text, titleFull]);

  return (
    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight min-h-[1.2em]">
      <span className="text-indigo-600 cursor-blink inline">
        {text}
      </span>
    </h1>
  );
};

/** 带加载占位的图片：未加载时显示骨架动画，加载完成后淡入 */
const ImageWithPlaceholder = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className="absolute inset-0 block">
      <span
        className={`absolute inset-0 bg-slate-200/80 animate-pulse transition-opacity duration-300 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden
      />
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-out ${className} ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
};

/** 滚动进入视口时添加 in-view 类 */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return [ref, inView];
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.2 });
  const [templatesRef, templatesInView] = useInView({ threshold: 0.1 });
  const [card1Ref, card1InView] = useInView({ threshold: 0.2 });
  const [card2Ref, card2InView] = useInView({ threshold: 0.2 });
  const [card3Ref, card3InView] = useInView({ threshold: 0.2 });
  const [card4Ref, card4InView] = useInView({ threshold: 0.2 });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col overflow-x-hidden">
      <header className="px-6 py-5 border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-indigo-600" size={26} />
            {t('nav.appName')}
          </span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/builder"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {t('nav.startBuild')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16 pb-24">
        {/* 主标题区 - 打字机 + 入场动画 */}
        <div
          ref={heroRef}
          className={`max-w-2xl mx-auto text-center space-y-8 transition-all duration-700 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <TypewriterTitle key={i18n.language} />
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('home.subtitle')}
          </p>
          <div
            ref={ctaRef}
            className={`transition-all duration-600 delay-200 ${
              ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 hover:-translate-y-0.5"
            >
              {t('home.cta')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* 模板样图区域：预留两个图片位置，带上下滑动动画 */}
        <section
          ref={templatesRef}
          className={`w-full max-w-4xl mx-auto mt-20 transition-all duration-700 ${
            templatesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-center text-xl font-bold text-slate-700 mb-8">
            {t('home.chooseTemplate')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 现代风格：简介 + 悬浮/离开动效 */}
            <div
              ref={card1Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-100 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  {t('home.templateModern')}<br /> {t('home.comingSoon')}
                </span>
                {TEMPLATE_IMAGE_1 && (
                  <ImageWithPlaceholder
                    src={TEMPLATE_IMAGE_1}
                    alt="现代风格模板"
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">{t('home.templateModern')}</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  {t('home.descModern')}
                </p>
              </div>
            </div>

            {/* 经典风格 */}
            <div
              ref={card2Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-200 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  {t('home.templateClassic')}<br /> {t('home.comingSoon')}
                </span>
                {TEMPLATE_IMAGE_2 && (
                  <ImageWithPlaceholder
                    src={TEMPLATE_IMAGE_2}
                    alt="经典风格模板"
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">{t('home.templateClassic')}</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  {t('home.descClassic')}
                </p>
              </div>
            </div>

            {/* GitHub 风格 */}
              <div
              ref={card3Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-200 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card3InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  {t('home.templateGithub')}<br /> {t('home.comingSoon')}
                </span>
                {TEMPLATE_IMAGE_3 && (
                  <ImageWithPlaceholder
                    src={TEMPLATE_IMAGE_3}
                    alt="GitHub 风格模板"
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">{t('home.templateGithub')}</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  {t('home.descGithub')}
                </p>
              </div>
            </div>

            {/* Finding your dream job */}
            <div
              ref={card4Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-200 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card4InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  {t('home.templateDream')}<br /> {t('home.comingSoon')}
                </span>
                {TEMPLATE_IMAGE_4 && (
                  <ImageWithPlaceholder
                    src={TEMPLATE_IMAGE_4}
                    alt="Finding your dream job"
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">{t('home.templateDream')}</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  {t('home.descDream')}
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
