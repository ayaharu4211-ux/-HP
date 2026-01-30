
import React from 'react';

const Hero = ({ data, isAdmin, EditableText, EditableImage, navigate, isEditingImage }: any) => {
  // サブタイトルが空の場合は表示しない（管理者モードで編集したい場合のみ表示）
  const hasSubTitle = data.hero.subTitle && data.hero.subTitle.trim() !== '';
  const showSubTitle = isAdmin || hasSubTitle;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* 背景画像レイヤー 編集時は前面のテキストを完全に無視させるために z-indexを適切に管理 */}
      <div className={`absolute inset-0 ${isEditingImage ? 'z-[999999]' : 'z-10'}`}>
        <EditableImage path="hero.bgImage" className="w-full h-full object-cover opacity-60 scale-105" alt="Hero BG" />
      </div>
      
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-950/80 pointer-events-none z-[15]"></div>

      {/* テキストレイヤー 編集時は pointer-events-none を全体に適用 */}
      <div className={`relative z-[20] max-w-7xl mx-auto px-6 w-full text-center transition-all duration-500 ${isEditingImage ? 'opacity-0 pointer-events-none' : 'pointer-events-none'}`}>
        <div className="max-w-4xl mx-auto space-y-12">
          {showSubTitle && (
            <div className={`inline-block px-8 py-2 border border-white/20 rounded-full backdrop-blur-md pointer-events-auto hover:scale-105 transition-all ${!hasSubTitle && isAdmin ? 'opacity-50' : ''}`}>
              <EditableText path="hero.subTitle" className="text-white text-[10px] font-bold tracking-[0.6em] uppercase block" hideOnImageEdit={true} />
            </div>
          )}
          
          <div className="pointer-events-auto">
            <EditableText path="hero.title" className="text-6xl md:text-9xl font-bold text-white luxury-serif tracking-tight block" element="h1" hideOnImageEdit={true} />
          </div>
          
          <div className="pointer-events-auto">
            <EditableText path="hero.description" className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light block" element="p" hideOnImageEdit={true} />
          </div>
          
          <div className="flex justify-center pt-10 pointer-events-auto">
            <button 
              onClick={() => navigate('services')}
              className="px-12 py-5 bg-white text-slate-900 rounded-full text-xs font-bold tracking-[0.4em] uppercase hover:bg-slate-100 transition-all flex items-center gap-4 group/btn"
            >
              <EditableText path="hero.btnText" className="inline-block" hideOnImageEdit={true} />
              <i className="fa-solid fa-chevron-right group-hover/btn:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 管理者向けヒント */}
      {isAdmin && !isEditingImage && (
        <div className="absolute bottom-6 right-10 z-30 pointer-events-none opacity-40">
          <p className="text-[8px] text-white/60 tracking-[0.3em] uppercase font-bold">
            背景画像をクリックして編集
          </p>
        </div>
      )}
    </section>
  );
};

export default Hero;
