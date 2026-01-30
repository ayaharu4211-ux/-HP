
import React from 'react';

const CareerPage = ({ data, isAdmin, updateData, EditableText, EditableImage, ListControls, navigate }: any) => {
  return (
    <div className="pt-48 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[4rem] overflow-hidden aspect-[21/9] mb-32 corporate-shadow">
          <EditableImage path="hero.bgImage" className="w-full h-full object-cover brightness-50" alt="Culture" />
          <div className="absolute inset-0 flex items-center justify-center">
            <EditableText path="careers.title" className="luxury-serif text-6xl md:text-8xl text-white block text-center" element="h2" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-32 text-center">
          <EditableText path="careers.description" className="text-slate-500 leading-relaxed text-xl font-light block text-center" element="p" />
        </div>

        <div className="mb-20 flex justify-between items-end border-b border-slate-100 pb-12">
          <div className="text-left">
            <EditableText path="careers.sectionTitle" className="luxury-serif text-3xl text-slate-900 mb-2 block" element="h3" />
            <EditableText path="careers.sectionSub" className="text-slate-400 text-[10px] tracking-[0.3em] font-bold uppercase block" element="p" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => updateData('careers.jobs', [...data.careers.jobs, { id: 'j'+Date.now(), title: '新規募集', dept: '部署名', location: '勤務地', salary: '年俸 000万円' }])}
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest"
            >+ 募集追加</button>
          )}
        </div>

        <div className="space-y-4">
          {data.careers.jobs.map((job: any, idx: number) => (
            <div key={job.id} className="flex flex-col md:flex-row items-center justify-between p-12 bg-slate-50 rounded-[3rem] hover:bg-slate-100 transition-all group relative border border-transparent hover:border-slate-200">
              <div className="flex-1 mb-8 md:mb-0 text-left">
                <div className="flex items-center gap-6 mb-4">
                  <EditableText path={`careers.jobs.${idx}.dept`} className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                  <EditableText path={`careers.jobs.${idx}.location`} className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400" />
                </div>
                <EditableText path={`careers.jobs.${idx}.title`} className="luxury-serif text-3xl text-slate-900 block" element="h4" />
                <div className="mt-8 flex items-center gap-4">
                  <span className="text-[8px] tracking-widest text-slate-400 font-bold uppercase border border-slate-200 px-3 py-1 rounded">給与目安</span>
                  <EditableText path={`careers.jobs.${idx}.salary`} className="text-sm font-medium text-slate-600 block" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-6">
                <ListControls path="careers.jobs" index={idx} listLength={data.careers.jobs.length} />
                <button 
                  onClick={() => navigate('contact')}
                  className="px-10 py-4 bg-slate-900 text-white rounded-full text-[11px] font-bold tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                   <EditableText path="careers.applyBtn" className="inline-block" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
