import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const TITLE_FULL = '快速制作专业简历';
const TYPE_INTERVAL = 120;

/** 替换为你的模板样图路径，例如 '/templates/modern.png'；留空则显示占位 */
const TEMPLATE_IMAGE_1 = 'src/assets/morden.png'; // 现代风格
const TEMPLATE_IMAGE_2 = 'src/assets/classical.png';//经典风格
const TEMPLATE_IMAGE_3 = 'src/assets/github.png';//GitHub 风格

const TEMPLATE_IMAGE_4 = 'src/assets/findingtheme.png';//finding your dream jb
/** 打字机效果：逐字显示文案 */ 
const TypewriterTitle = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (text.length >= TITLE_FULL.length) return;
    const t = setTimeout(() => {
      setText(TITLE_FULL.slice(0, text.length + 1));
    }, TYPE_INTERVAL);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight min-h-[1.2em]">
      <span className="text-indigo-600 cursor-blink inline">
        {text}
      </span>
    </h1>
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
  }, []);

  return [ref, inView];
};

const Home = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.2 });
  const [templatesRef, templatesInView] = useInView({ threshold: 0.1 });
  const [card1Ref, card1InView] = useInView({ threshold: 0.2 });
  const [card2Ref, card2InView] = useInView({ threshold: 0.2 });
  const [card3Ref, card3InView] = useInView({ threshold: 0.2 });      
  const [card4Ref,card4InView] = useInView({threshold:0.2});
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col overflow-x-hidden">
      <header className="px-6 py-5 border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-indigo-600" size={26} />
            简历制作
          </span>
          <Link
            to="/builder"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            进入制作
          </Link>
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
          <TypewriterTitle />
          <p className="text-lg text-slate-600 leading-relaxed">
            选择模板、填写内容、实时预览，一键导出 PDF。支持多种区块组合，随时调整版式。
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
              制作简历
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
            选择你喜欢的模板
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
                  模板样图 1<br />（设置 TEMPLATE_IMAGE_1 为图片路径）
                </span>
                {TEMPLATE_IMAGE_1 && (
                  <img
                    src={TEMPLATE_IMAGE_1}
                    alt="现代风格模板"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">现代风格</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  信息分区清晰，含个人简介与技能标签，适合互联网、设计类岗位。
                </p>
              </div>
            </div>

            {/* 经典风格：简介 + 悬浮/离开动效 */}
            <div
              ref={card2Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-200 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  模板样图 2<br />（设置 TEMPLATE_IMAGE_2 为图片路径）
                </span>
                {TEMPLATE_IMAGE_2 && (
                  <img
                    src={TEMPLATE_IMAGE_2}
                    alt="经典风格模板"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">经典风格</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  教育、经历优先，版式简洁，适合传统行业与应届生。
                </p>
              </div>
            </div>

              {/* Github风格：简介 + 悬浮/离开动效 */}
              <div
              ref={card3Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-200 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card3InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  模板样图 3<br />（设置 TEMPLATE_IMAGE_3 为图片路径）
                </span>
                {TEMPLATE_IMAGE_3 && (
                  <img
                    src={TEMPLATE_IMAGE_3}
                    alt="经典风格模板"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">GitHub 风格</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  左侧个人信息与链接，右侧经历/技能等，适合互联网、设计类岗位。
                </p>
              </div>
            </div>

            {/* Theme：简介 + 悬浮/离开动效 */}
            <div
              ref={card4Ref}
              className={`group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/80 shadow-lg transition-all duration-500 delay-200 ease-out hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-200 ${
                card4InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="aspect-[210/297] w-full relative overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-100/90">
                  模板样图 4<br />（设置 TEMPLATE_IMAGE_4 为图片路径）
                </span>
                {TEMPLATE_IMAGE_4 && (
                  <img
                    src={TEMPLATE_IMAGE_4}
                    alt="经典风格模板"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4 text-center bg-white/90 border-t border-slate-100 transition-colors duration-300 group-hover:bg-white">
                <div className="text-sm font-semibold text-slate-700">Finding your dream job</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                  加入梵高，寻找你的工作吧。是金子总会发光。加油！
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
