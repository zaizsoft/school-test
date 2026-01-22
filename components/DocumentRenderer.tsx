
import React from 'react';
import { AppState, Student, SchoolConfig } from '../types';
import { FULL_CONFIG, TERM_MAPPING } from '../constants';

// Updated props to support both state-based and individual document rendering
interface DocumentRendererProps {
  state?: AppState;
  onSignatureUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Support for specific rendering in PreviewView
  type?: string;
  students?: Student[];
  config?: SchoolConfig;
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({ 
  state, 
  onSignatureUpload,
  type,
  students: propStudents,
  config: propConfig
}) => {
  // Determine data source: either from the full state or from direct props (used in PreviewView)
  const config = propConfig || state?.config;
  
  // Guard against missing configuration
  if (!config) return null;

  const students = propStudents || state?.students || [];
  const signature = state?.signature || null;
  
  // Determine visibility: if a specific type is provided, only that one is visible
  const visiblePages = type ? { [type]: true } : (state?.visiblePages || {});

  const pedagogical = FULL_CONFIG[config.level]?.[config.term] || { kafaa: '', criteria: [] };

  // Updated DocWrapper to use a flexible visibility check
  const DocWrapper = ({ children, id, landscape = false }: { children: React.ReactNode, id: string, landscape?: boolean }) => (
    <div 
      id={id} 
      className={`bg-white shadow-2xl p-8 mb-12 mx-auto print-page ${landscape ? 'landscape-page print-landscape' : ''}`}
      style={{
        width: landscape ? '297mm' : '210mm',
        minHeight: landscape ? '210mm' : '297mm',
        display: (visiblePages as any)[id] ? 'block' : 'none'
      }}
    >
      {children}
    </div>
  );

  const StandardHeader = () => (
    <div className="flex justify-between items-start text-[11px] font-bold mb-4">
      <div className="space-y-1 text-right">
        <p>المؤسسة: <span>{config.schoolName}</span></p>
        <p>المستوى: <span>{config.level} إبتدائي ({config.subLevel})</span></p>
        <p>الأستاذ: <span>{config.teacherName}</span></p>
      </div>
      <div className="space-y-1 text-left">
        <p>السنة الدراسية: <span>{config.academicYear}</span></p>
        <p>الميدان: <span>{TERM_MAPPING[config.term]}</span></p>
        <p>الفصل: <span>{config.term}</span></p>
      </div>
    </div>
  );

  const AssessmentTable = () => (
    <table className="w-full border-collapse border border-black text-[10px]">
      <thead>
        <tr className="bg-slate-50">
          <th className="border border-black p-1 w-8" rowSpan={2}>رقم</th>
          <th className="border border-black p-1 w-40" rowSpan={2}>اللقب والاسم</th>
          {[1, 2, 3, 4, 5].map(m => (
            <th key={m} className="border border-black p-1 text-center bg-gray-100" colSpan={4}>
              {m === 5 ? 'الكفاءة' : `المعيار ${m}`}
            </th>
          ))}
          <th className="border border-black p-1 w-20" rowSpan={2}>الملاحظة</th>
        </tr>
        <tr className="text-[8px] font-bold">
          {Array(20).fill(0).map((_, i) => (
            <th key={i} className="border border-black w-5 text-center">{['أ', 'ب', 'ج', 'د'][i % 4]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 40 }).map((_, idx) => {
          const student = students[idx];
          return (
            <tr key={idx} className={`h-[18px] ${student?.isExempted ? 'bg-gray-100 text-gray-400' : ''}`}>
              <td className="border border-black text-center font-bold">{idx + 1}</td>
              <td className="border border-black pr-2 font-bold truncate">{student?.name || ''}</td>
              {student?.isExempted ? (
                <td colSpan={20} className="border border-black text-center font-black tracking-[1em]">معفـــــــــي</td>
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

  return (
    <>
      {/* Diagnostic Assessment */}
      <DocWrapper id="diagnostic">
        <div className="text-center mb-6">
          <div className="border-2 border-black inline-block px-10 py-2 rounded-full">
            <h2 className="text-xl font-bold">تقويم التشخيصي للكفاءة الختامية</h2>
          </div>
        </div>
        <StandardHeader />
        <div className="border-y-2 border-black py-2 mb-4 text-center text-[11px] font-bold">
          الكفاءة الختامية: {pedagogical.kafaa}
        </div>
        <div className="border-2 border-black mb-4 bg-white">
          <div className="font-bold py-1 text-center border-b border-black text-xs bg-slate-50">المعاييــــــــــــــــــــــــــــــــــــــــر</div>
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-black text-[10px] p-2 leading-tight">
            <div className="space-y-1 pr-2">
              <p>1- {pedagogical.criteria[0]}</p>
              <p>2- {pedagogical.criteria[1]}</p>
            </div>
            <div className="space-y-1 pr-2">
              <p>3- {pedagogical.criteria[2]}</p>
              <p>4- {pedagogical.criteria[3]}</p>
            </div>
          </div>
        </div>
        <AssessmentTable />
        <div className="mt-4 flex justify-between items-center text-[10px] font-bold px-4">
          <div className="flex gap-4">
            <span>د= تملك محدود (3/0)</span><span>ج= تملك جزئي (3/1)</span><span>ب= تملك مقبول (3/2)</span><span>أ= تملك أقصى (3/3)</span>
          </div>
          <div className="text-left">توقيع وختم الأستاذ: ..........................</div>
        </div>
      </DocWrapper>

      {/* Achievement Assessment */}
      <DocWrapper id="achievement">
        <div className="text-center mb-6">
          <div className="border-2 border-black inline-block px-10 py-2 rounded-full">
            <h2 className="text-xl font-bold">تقويم التحصيلي للكفاءة الختامية</h2>
          </div>
        </div>
        <StandardHeader />
        <div className="border-y-2 border-black py-2 mb-4 text-center text-[11px] font-bold">
          الكفاءة الختامية: {pedagogical.kafaa}
        </div>
        <div className="border-2 border-black mb-4 bg-white">
          <div className="font-bold py-1 text-center border-b border-black text-xs bg-slate-50">المعاييــــــــــــــــــــــــــــــــــــــــر</div>
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-black text-[10px] p-2 leading-tight">
            <div className="space-y-1 pr-2">
              <p>1- {pedagogical.criteria[0]}</p>
              <p>2- {pedagogical.criteria[1]}</p>
            </div>
            <div className="space-y-1 pr-2">
              <p>3- {pedagogical.criteria[2]}</p>
              <p>4- {pedagogical.criteria[3]}</p>
            </div>
          </div>
        </div>
        <AssessmentTable />
        <div className="mt-4 flex justify-between items-center text-[10px] font-bold px-4">
          <div className="flex gap-4">
            <span>د= تملك محدود (3/0)</span><span>ج= تملك جزئي (3/1)</span><span>ب= تملك مقبول (3/2)</span><span>أ= تملك أقصى (3/3)</span>
          </div>
          <div className="text-left">توقيع وختم الأستاذ: ..........................</div>
        </div>
      </DocWrapper>

      {/* Performance Card */}
      <DocWrapper id="performance">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black border-4 border-black inline-block px-12 py-3 rounded-2xl">بطاقة تقييم أداء التلاميذ</h2>
        </div>
        <StandardHeader />
        <div className="border-y border-black py-3 mb-4 font-bold text-center text-sm leading-relaxed">
          يتم تقييم التلميذ بشكل مستمر عن طريق رصد دائم للأداء من أول يوم في الفصل إلى حصة التقويم التحصيلي.
        </div>
        <table className="w-full border-collapse border-2 border-black">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold">
              <th className="border border-black p-1 w-8" rowSpan={2}>رقم</th>
              <th className="border border-black p-1 w-40" rowSpan={2}>اللقب والاسم</th>
              <th className="border border-black p-1 bg-gray-100" colSpan={3}>الالتزام بالتعليمات</th>
              <th className="border border-black p-1 bg-gray-100" colSpan={2}>الأداء الرياضي</th>
              <th className="border border-black p-1 w-12" rowSpan={2}>العلامة</th>
              <th className="border border-black p-1 w-24" rowSpan={2}>الملاحظة</th>
            </tr>
            <tr className="text-[9px] font-bold">
              <th className="border border-black">الحضور (1)</th>
              <th className="border border-black">اللباس (1)</th>
              <th className="border border-black">السلوك (3)</th>
              <th className="border border-black">المشاركة (3)</th>
              <th className="border border-black">التنسيق (2)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 40 }).map((_, idx) => {
              const student = students[idx];
              return (
                <tr key={idx} className={`h-[18px] text-[10px] ${student?.isExempted ? 'bg-gray-100 text-gray-400' : ''}`}>
                  <td className="border border-black text-center font-bold">{idx + 1}</td>
                  <td className="border border-black pr-2 font-bold truncate">{student?.name || ''}</td>
                  {student?.isExempted ? (
                    <td colSpan={6} className="border border-black text-center font-black tracking-[1em]">معفـــــــــي</td>
                  ) : (
                    Array(7).fill(0).map((_, i) => <td key={i} className="border border-black"></td>)
                  )}
                  <td className="border border-black text-center font-bold text-[8px]">{student?.isExempted ? 'معفى' : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-8 flex justify-end px-12">
          <div className="text-center group relative cursor-pointer no-print">
            <p className="font-bold text-xs mb-2">إمضاء الأستاذ:</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-all">
              {signature ? (
                <img src={signature} className="max-h-20" alt="توقيع" />
              ) : (
                <div className="text-[10px] text-slate-400 font-bold">اضغط لإضافة توقيعك</div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={onSignatureUpload} />
            </label>
          </div>
          {/* Print only signature */}
          <div className="hidden print:block text-center px-12">
             <p className="font-bold text-xs mb-2">إمضاء الأستاذ:</p>
             {signature && <img src={signature} className="max-h-16 mx-auto" alt="توقيع" />}
          </div>
        </div>
      </DocWrapper>

      {/* Attendance Register */}
      <DocWrapper id="attendance" landscape>
        <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
          <div className="text-right text-[10px] font-bold">
            <p>المؤسسة: <span>{config.schoolName}</span></p>
            <p>الأستاذ: <span>{config.teacherName}</span></p>
          </div>
          <h2 className="text-2xl font-black border-2 border-black px-8 py-2 rounded-xl bg-gray-50">سجل المناداة وتتبع الغيابات</h2>
          <div className="text-left text-[10px] font-bold">
            <p>المستوى: <span>{config.level} إبتدائي ({config.subLevel})</span></p>
            <p>الموسم: <span>{config.academicYear}</span></p>
          </div>
        </div>
        <table className="w-full border-collapse border-2 border-black text-[8px]">
          <thead>
             <tr className="bg-gray-100">
               <th className="border border-black w-6" rowSpan={3}>ر</th>
               <th className="border border-black w-40" rowSpan={3}>اللقب والاسم</th>
               {['سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي'].map(m => (
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
              <tr key={idx} className={`h-[16px] ${students[idx]?.isExempted ? 'bg-gray-50' : ''}`}>
                <td className="border border-black text-center font-bold">{idx + 1}</td>
                <td className="border border-black pr-1 font-bold truncate">{students[idx]?.name || ''}</td>
                {Array(36).fill(0).map((_, i) => (
                  <td key={i} className="border border-black text-center font-bold">
                    {students[idx]?.isExempted ? 'X' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-[9px] font-bold px-2 bg-slate-50 border border-slate-200 py-1 rounded flex justify-between">
            <span><strong>حاضر:</strong> تترك فارغة</span>
            <span><strong>غائب:</strong> غ</span>
            <span><strong>متأخر:</strong> م</span>
            <span><strong>بدون لباس:</strong> ب</span>
            <span><strong>مريض (شهادة):</strong> ض</span>
            <span><strong>معفي:</strong> X</span>
        </div>
      </DocWrapper>

      {/* Separator Page */}
      <DocWrapper id="separator">
        <div className="h-[270mm] border-[12px] border-double border-black flex flex-col justify-center items-center relative rounded-[4rem]">
            <div className="text-center space-y-12">
                <div className="border-4 border-black p-12 rounded-3xl">
                    <h1 className="font-black text-7xl">{config.term}</h1>
                </div>
                <p className="text-4xl font-bold tracking-widest text-slate-700">دفتر متابعة التقويم التربوي</p>
                <div className="bg-black text-white px-10 py-4 rounded-full text-3xl font-bold">
                    الميدان: <span>{TERM_MAPPING[config.term]}</span>
                </div>
                <div className="space-y-4 text-xl font-bold pt-12">
                   <p>الأستاذ: {config.teacherName}</p>
                   <p>المؤسسة: {config.schoolName}</p>
                   <p>السنة الدراسية: {config.academicYear}</p>
                </div>
            </div>
        </div>
      </DocWrapper>
    </>
  );
};

export default DocumentRenderer;
