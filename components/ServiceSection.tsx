
import React from 'react';

const ServiceSection = ({ data, navigate, isAdmin, EditableText, EditableImage }: any) => {
  return (
    <section id="services" className="py-16 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-6">
          <div className="max-w-2xl">
            <EditableText path="serviceLabels.sub" className="text-slate-400 text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase mb-3 md:mb-6 block" element="p" />
            <EditableText path="serviceLabels.title" className="luxury-serif text-2xl md:text-5xl text-slate-900 block leading-tight" element="h3" />
          </div>
          <button 
            onClick={() => navigate('services')} 
            className="text-[9px] md:text-[11px] font-bold tracking-[0.3em] uppercase pb-2 border-b border-slate-200 hover:border-slate-900 transition-all w-fit"
          >
            <EditableText path="serviceLabels.allBtn" className="inline-block" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
          {data.services.slice(0, 4).map((service: any, idx: number) => (
            <div key={service.id} className="group cursor-pointer" onClick={() => navigate('services')}>
              <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[3rem] mb-6 aspect-[16/10] corporate-shadow">
                <EditableImage path={`services.${idx}.image`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
              <div className="px-2">
                <EditableText path={`services.${idx}.title`} className="luxury-serif text-lg md:text-3xl text-slate-900 mb-3 block truncate" />
                <EditableText path={`services.${idx}.description`} className="text-slate-500 text-xs md:text-lg leading-relaxed font-light block line-clamp-2 md:line-clamp-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
