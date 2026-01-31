
import React from 'react';

const Hero = ({ data, isAdmin, updateData, EditableText, EditableImage, navigate, isEditingImage }: any) => {
  const hasSubTitle = data.hero.subTitle && data.hero.subTitle.trim() !== '';
  const showSubTitle = isAdmin || hasSubTitle;

  const removeSubTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('サブタイトル（バッジ部分）を削除しますか？')) {
      updateData('hero.subTitle', '');
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className={`absolute inset-0 ${isEditingImage ? 'z-[999999]' : 'z-10'}`}>
        {/* ヒーロー画像は高画質設定（1920px / 画質 0.8） */}
        <EditableImage 
          path="hero.bgImage" 
          maxWidth={1920} 
          quality={0.8} 
          className="w-full h-full object-cover opacity-100 brightness-100 transition-all duration-1000" 
          alt="Hero BG" 
        />
      </div>
      
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-[15]"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-[15]"></div>

      <div className={`relative z-[20] max-w-7xl mx-auto px-4 w-full text-center transition-all duration-500 ${isEditingImage ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {showSubTitle && (
            <div className={`group/sub relative inline-block px-4 md:px-8 py-2 border border-white/40 rounded-full backdrop-blur-md hover:scale-105 transition-all mb-6 md:mb-12 shadow-lg ${!hasSubTitle && isAdmin ? 'opacity-30 border-dashed bg-red-500/10' : ''}`}>
              <EditableText path="hero.subTitle" className="text-white text-fit-sub font-bold uppercase block drop-shadow-md" hideOnImageEdit={true} />
              
              {isAdmin && (
                <button 
                  onClick={removeSubTitle}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/sub:opacity-100 transition-opacity text-[10px] shadow-xl z-[100]"
                  title="この項目を削除"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          )}
          
          <div className="w-full overflow-hidden flex justify-center">
            <EditableText 
              path="hero.title" 
              className="text-white luxury-serif tracking-tight block text-fit-title drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
              element="h1" 
              hideOnImageEdit={true} 
            />
          </div>
          
          <div className="mt-6 md:mt-12">
            <EditableText path="hero.description" className="text-[10px] sm:text-sm md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-medium block drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" element="p" hideOnImageEdit={true} />
          </div>
          
          <div className="flex justify-center pt-8 md:pt-16">
            <button 
              onClick={() => navigate('services')}
              className="px-8 md:px-12 py-3 md:py-5 !bg-white !text-slate-900 rounded-full text-[9px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase hover:bg-slate-100 transition-all flex items-center gap-3 md:gap-4 group/btn shadow-2xl relative z-30"
            >
              <EditableText path="hero.btnText" className="inline-block !text-slate-900" hideOnImageEdit={true} />
              <i className="fa-solid fa-chevron-right text-[8px] md:text-xs !text-slate-900 group-hover/btn:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
