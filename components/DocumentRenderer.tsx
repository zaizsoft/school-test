
import React from 'react';
import { Student, SchoolConfig } from '../types';
import { PEDAGOGICAL_CONFIG, TERM_MAPPING } from '../constants';

interface DocumentRendererProps {
  type: string;
  students: Student[];
  config: SchoolConfig;
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({ type, students, config }) => {
  const pedagogical = PEDAGOGICAL_CONFIG[config.level]?.[config.term] || { kafaa: '', criteria: ['', '', '', ''] };
  const field = TERM_MAPPING[config.term] || '';

  // Standard Header Component for documents
  const DocHeader = () => (
    <div className="mb-6">
      <div className="flex justify-between items-start text-[11px] font-bold mb-4">
        <div className="space-y-1 text-right">
          <p>المؤسسة: <span>{config.schoolName}</span></p>
          <p>المستوى: <span>{config.level} إبتدائي ({config.subLevel})</span></p>
          <p>الأستاذ: <span>{config.teacherName}</span></p>
        </div>
        <div className="space-y-1 text-left">
          <p>السنة الدراسية: <span>{config.academicYear}</span></p>
          <p>الميدان: <span>{field}</span></p>
          <p>الفصل: <span>{config.term}</span></p>
        </div>
      </div>
      <div className="border-y-2 border-black py-2 text-center text-[11px] font-bold leading-relaxed">
        الكفاءة الختامية: {pedagogical.kafaa}
      </div>
    </div>
  );

  const CriteriaBox = () => (
    <div className="border-2 border-black mb-4 overflow-hidden">
      <div className="bg-slate-50 border-b border-black text-center font-black py-1 text-xs">معايير التقييم</div>
      <div className="grid grid-cols-2 divide-x divide-x-reverse divide-black text-[10px] p-2 leading-tight">
        <div className="space-y-1 pr-2">
          <p>1. {pedagogical.criteria[0]}</p>
          <p>2. {pedagogical.criteria[1]}</p>
        </div>
        <div className="space-y-1 pr-2">
          <p>3. {pedagogical.criteria[2]}</p>
          <p>4. {pedagogical.criteria[3]}</p>
        </div>
      </div>
    </div>
  );

  const StudentTable = () => (
    <table className="w-full border-collapse border-2 border-black">
      <thead>
        <tr className="bg-slate-50 text-[9px] font-black">
          <th className="border border-black p-1 w-8">رقم</th>
          <th className="border border-black p-1 w-40">اللقب والاسم</th>
          {[1,2,3,4,5].map(c => (
            <React.Fragment key={c}>
               <th className="border border-black p-0.5 text-center" colSpan={4}>{c === 5 ? 'الكفاءة' : `م${c}`}</th>
            </React.Fragment>
          ))}
          <th className="border border-black p-1">ملاحظة</th>
        </tr>
        <tr className="text-[7px] font-bold">
          <th className="border border-black"></th>
          <th className="border border-black"></th>
          {Array(20).fill(0).map((_, i) => (
            <th key={i} className="border border-black w-4">
              {['أ','ب','ج','د'][i % 4]}
            </th>
          ))}
          <th className="border border-black"></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 40 }).map((_, idx) => {
          const student = students[idx];
          return (
            <tr key={idx} className={`h-[18px] text-[10px] ${student?.isExempted ? 'bg-slate-50' : ''}`}>
              <td className="border border-black text-center font-bold">{idx + 1}</td>
              <td className="border border-black pr-2 font-bold truncate">{student?.name || ''}</td>
              {student?.isExempted ? (
                <td colSpan={20} className="border border-black text-center font-black text-slate-400 tracking-[1em]">معفـــــــــي</td>
              ) : (
                Array(20).fill(0).map((_, i) => <td key={i} className="border border-black"></td>)
              )}
              <td className="border border-black text-center text-[8px]">{student?.isExempted ? 'معفى' : ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const Legend = () => (
    <div className="mt-4 flex justify-between items-center text-[10px] font-bold px-4">
       <div className="flex gap-4">
         <span>أ = تملك أقصى</span>
         <span>ب = تملك مقبول</span>
         <span>ج = تملك جزئي</span>
         <span>د = تملك محدود</span>
       </div>
       <div className="text-left">توقيع وختم الأستاذ: ..........................</div>
    </div>
  );

  if (type === 'separator') {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="w-full h-full border-[12px] border-double border-black rounded-[4rem] flex flex-col items-center justify-center p-12 text-center">
           <div className="border-4 border-black px-12 py-8 rounded-3xl mb-12">
             <h1 className="text-7xl font-black text-slate-900">{config.term}</h1>
           </div>
           <p className="text-3xl font-bold text-slate-600 mb-8">دفتر متابعة التقويم التربوي</p>
           <div className="bg-black text-white px-10 py-4 rounded-full text-2xl font-black mb-12">
             الميدان: {field}
           </div>
           <div className="space-y-4 text-xl font-bold text-slate-800">
             <p>الأستاذ: {config.teacherName}</p>
             <p>المؤسسة: {config.schoolName}</p>
             <p>السنة الدراسية: {config.academicYear}</p>
           </div>
        </div>
      </div>
    );
  }

  if (type === 'attendance') {
    return (
      <div className="w-full text-right p-2">
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <div className="text-[10px] font-bold">
            <p>المؤسسة: {config.schoolName}</p>
            <p>الأستاذ: {config.teacherName}</p>
          </div>
          <h2 className="text-2xl font-black border-2 border-black px-8 py-1.5 rounded-xl">سجل المناداة وتتبع الغيابات</h2>
          <div className="text-[10px] font-bold">
            <p>المستوى: {config.level} إبتدائي</p>
            <p>الموسم: {config.academicYear}</p>
          </div>
        </div>
        
        <table className="w-full border-collapse border-2 border-black text-[8px]">
          <thead>
             <tr className="bg-slate-50">
               <th className="border border-black w-6" rowSpan={3}>ر</th>
               <th className="border border-black w-40" rowSpan={3}>اللقب والاسم</th>
               {['سبتمبر','أكتوبر','نوفمبر','ديسمبر','جانفي','فيفري','مارس','أفريل','ماي'].map(m => (
                 <th key={m} className="border border-black bg-slate-200 py-1" colSpan={4}>{m}</th>
               ))}
             </tr>
             <tr>
                {Array(9).fill(0).map((_, i) => (
                  <React.Fragment key={i}>
                    <th className="border border-black" colSpan={2}>أ1</th>
                    <th className="border border-black" colSpan={2}>أ2</th>
                  </React.Fragment>
                ))}
             </tr>
             <tr>
                {Array(36).fill(0).map((_, i) => (
                   <th key={i} className="border border-black font-normal">{i % 2 === 0 ? 'ح' : 'م'}</th>
                ))}
             </tr>
          </thead>
          <tbody>
            {Array.from({ length: 35 }).map((_, idx) => (
              <tr key={idx} className="h-[14px]">
                <td className="border border-black text-center font-bold">{idx + 1}</td>
                <td className="border border-black pr-1 font-bold truncate">{students[idx]?.name || ''}</td>
                {Array(36).fill(0).map((_, i) => <td key={i} className="border border-black"></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-2 grid grid-cols-4 gap-2 text-[8px] font-bold">
          <p>غ: غياب غير مبرر</p>
          <p>م: متأخر</p>
          <p>ب: بدون لباس رياضي</p>
          <p>ض: غياب مبرر (مرضي)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-6">
        <h2 className="inline-block border-2 border-black px-8 py-2.5 rounded-full text-xl font-black">
          {type === 'diagnostic' ? 'تقويم التشخيصي للكفاءة الختامية' : 'تقويم التحصيلي للكفاءة الختامية'}
        </h2>
      </div>
      
      <DocHeader />
      <CriteriaBox />
      <StudentTable />
      <Legend />
    </div>
  );
};

export default DocumentRenderer;
