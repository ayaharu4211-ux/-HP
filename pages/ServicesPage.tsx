
import React from 'react';

const ServicesPage = ({ data, isAdmin, updateData, EditableText, EditableImage, ListControls, navigate }: any) => {
  return (
    <div className="pt-48 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-32 flex justify-between items-end pb-12">
          <div className="text-left">
            <EditableText path="services.title" className="luxury-serif text-5xl text-slate-900 mb-4 block" element="h2" />
            <EditableText path="serviceLabels.sub" className="text-slate-400 text-xs tracking-[0.3em] font-bold uppercase block" element="p" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => updateData('services', [...data.services, { id: 's'+Date.now(), title: '新規事業', description: '事業概要', image: '', fullContent: '詳細な戦略および事業内容' }])}
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest"
            >+ 事業追加</button>
          )}
        </div>

        <div className="space-y-48">
          {data.services.map((service: any, idx: number) => (
            <div key={service.id} className={`flex flex-col md:flex-row items-center gap-24 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''} relative group`}>
              <div className="flex-1 w-full text-left">
                <div className="relative rounded-[3rem] overflow-hidden corporate-shadow aspect-[4/3]">
                  <EditableImage path={`services.${idx}.image`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt={service.title} />
                </div>
              </div>
              <div className="flex-1 space-y-10 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex-1"></div>
                  <ListControls path="services" index={idx} listLength={data.services.length} />
                </div>
                <div>
                  <EditableText path={`services.${idx}.title`} className="luxury-serif text-4xl text-slate-900 block mb-8" element="h4" />
                  <EditableText path={`services.${idx}.fullContent`} className="text-slate-500 leading-relaxed text-xl font-light block" element="p" />
                </div>
                <div className="pt-8">
                  <button 
                    onClick={() => navigate('portfolio')}
                    className="text-[11px] font-bold tracking-[0.3em] uppercase pb-2 hover:opacity-50 transition-all"
                  >
                    <EditableText path="serviceLabels.detailBtn" className="inline-block" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
