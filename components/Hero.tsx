
import React from 'react';

const Hero = ({ data, isAdmin, EditableText, EditableImage, navigate, isEditingImage }: any) => {
  const hasSubTitle = data.hero.subTitle && data.hero.subTitle.trim() !== '';
  const showSubTitle = isAdmin || hasSubTitle;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <div className={`absolute inset-0 ${isEditingImage ? 'z-[999999]' : 'z-10'}`}>
        <EditableImage path="hero.bgImage" className="w-full h-full object-cover opacity-60 scale-105" alt="Hero BG" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-950/80 pointer-events-none z-[15]"></div>

      <div className={`relative z-[20] max-w-7xl mx-auto px-4 w-full text-center transition-all duration-500 ${isEditingImage ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {showSubTitle && (
            <div className={`inline-block px-4 md:px-8 py-2 border border-white/20 rounded-full backdrop-blur-md hover:scale-105 transition-all mb-6 md:mb-12 ${!hasSubTitle && isAdmin ? 'opacity-50' : ''}`}>
              <EditableText path="hero.subTitle" className="text-white text-fit-sub font-bold uppercase block" hideOnImageEdit={true} />
            </div>
          )}
          
          <div className="w-full overflow-hidden flex justify-center">
            <EditableText 
              path="hero.title" 
              className="text-white luxury-serif tracking-tight block text-fit-title" 
              element="h1" 
              hideOnImageEdit={true} 
            />
          </div>
          
          <div className="mt-6 md:mt-12">
            <EditableText path="hero.description" className="text-[10px] sm:text-sm md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light block" element="p" hideOnImageEdit={true} />
          </div>
          
          <div className="flex justify-center pt-8 md:pt-16">
            <button 
              onClick={() => navigate('services')}
              className="px-8 md:px-12 py-3 md:py-5 bg-white text-slate-900 rounded-full text-[9px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase hover:bg-slate-100 transition-all flex items-center gap-3 md:gap-4 group/btn shadow-2xl"
            >
              <EditableText path="hero.btnText" className="inline-block" hideOnImageEdit={true} />
              <i className="fa-solid fa-chevron-right text-[8px] md:text-xs group-hover/btn:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
