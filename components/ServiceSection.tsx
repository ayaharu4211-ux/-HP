
import React from 'react';

const ServiceSection = ({ data, navigate, isAdmin, EditableText, EditableImage }: any) => {
  return (
    <section id="services" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 pb-16">
          <div className="max-w-2xl text-left">
            <EditableText path="serviceLabels.sub" className="text-slate-400 text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block" element="p" />
            <EditableText path="serviceLabels.title" className="luxury-serif text-5xl text-slate-900 block" element="h3" />
          </div>
          <button 
            onClick={() => navigate('services')} 
            className="text-[11px] font-bold tracking-[0.3em] uppercase pb-2 hover:opacity-50 transition-all"
          >
            <EditableText path="serviceLabels.allBtn" className="inline-block" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {data.services.slice(0, 4).map((service: any, idx: number) => (
            <div key={service.id} className="group cursor-pointer relative overflow-hidden" onClick={() => navigate('services')}>
              <div className="relative overflow-hidden rounded-[3rem] mb-10 aspect-[16/10] corporate-shadow">
                <EditableImage path={`services.${idx}.image`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
              <div className="px-4 text-left">
                <EditableText path={`services.${idx}.title`} className="luxury-serif text-3xl text-slate-900 mb-6 block" />
                <EditableText path={`services.${idx}.description`} className="text-slate-500 text-lg leading-relaxed font-light block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
