
import React, { useState } from 'react';
import { Layout, Users, Settings, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { Student, SchoolConfig, DocumentType, MarginSettings } from './types';
import DataView from './components/DataView';
import CustomizationView from './components/CustomizationView';
import PreviewView from './components/PreviewView';

const App: React.FC = () => {
  // حالة تتبع الخطوة الحالية في مسار العمل
  const [step, setStep] = useState(1);
  
  // قائمة التلاميذ في الفوج التربوي
  const [students, setStudents] = useState<Student[]>([]);
  
  // إعدادات المؤسسة التعليمية والأستاذ المشرف
  const [config, setConfig] = useState<SchoolConfig>({
    schoolName: "المؤسسة التربوية",
    level: "أولى",
    subLevel: "أ",
    teacherName: "الأستاذ(ة)",
    academicYear: "2024/2025",
    term: "الفصل الأول"
  });

  // الوثائق المتاحة للاستخراج مع حالات اختيارها
  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: 'diagnostic', title: 'تقويم تشخيصي', description: 'يستخدم في بداية الفترة لتقييم المكتسبات القبلية', icon: 'ClipboardList', selected: true },
    { id: 'achievement', title: 'تقويم تحصيلي', description: 'يستخدم في نهاية الفترة لتقييم النتائج الختامية', icon: 'Trophy', selected: true },
    { id: 'attendance', title: 'سجل المناداة', description: 'متابعة الحضور والغياب بشكل أفقي مفصل', icon: 'Activity', selected: false },
    { id: 'separator', title: 'ورقة فاصلة', description: 'ورقة غلاف للفصل الدراسي الحالي', icon: 'Layers', selected: false }
  ]);

  // التحكم في هوامش الصفحات والإزاحات للطباعة الدقيقة
  const [margins, setMargins] = useState<MarginSettings>({
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    verticalOffset: 0
  });

  // تبديل حالة الإعفاء لتلميذ معين (معفى طبياً)
  const handleToggleExempt = (id: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isExempted: !s.isExempted } : s));
  };

  // مسح كافة البيانات الحالية للبدء من جديد
  const handleReset = () => {
    if (confirm("هل أنت متأكد من مسح جميع البيانات الحالية؟")) {
      setStudents([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* شريط الملاحة العلوي - يختفي تلقائياً عند الطباعة */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 leading-none">مساعد الأستاذ</h1>
              <p className="text-xs font-bold text-slate-400 mt-1">نظام استخراج الوثائق التربوية 2.0</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {[
              { id: 1, label: 'إدارة البيانات', icon: <Users className="w-4 h-4" /> },
              { id: 2, label: 'تخصيص الوثائق', icon: <Settings className="w-4 h-4" /> },
              { id: 3, label: 'معاينة الطباعة', icon: <Eye className="w-4 h-4" /> }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                disabled={s.id > 1 && students.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                  step === s.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-100 disabled:opacity-30'
                }`}
              >
                {s.icon}
                <span className="hidden md:inline">{s.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* المرحلة الأولى: استيراد وتجهيز البيانات */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <DataView 
              students={students} 
              setStudents={setStudents} 
              config={config} 
              setConfig={setConfig} 
              onToggleExempt={handleToggleExempt}
              onReset={handleReset}
             />
             {students.length > 0 && (
               <div className="mt-12 flex justify-end">
                 <button 
                  onClick={() => setStep(2)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-[2rem] font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                 >
                   متابعة التخصيص
                   <ChevronLeft className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>
        )}

        {/* المرحلة الثانية: اختيار الوثائق المطلوبة */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CustomizationView documents={documents} setDocuments={setDocuments} />
            <div className="mt-12 flex justify-between">
               <button 
                  onClick={() => setStep(1)}
                  className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-4 rounded-[2rem] font-black flex items-center gap-3 hover:bg-slate-50 transition-all"
               >
                 <ChevronRight className="w-5 h-5" />
                 تعديل البيانات
               </button>
               <button 
                  onClick={() => setStep(3)}
                  className="bg-orange-500 text-white px-10 py-4 rounded-[2rem] font-black flex items-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100"
               >
                 الانتقال للمعاينة
                 <Eye className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}

        {/* المرحلة الثالثة: المعاينة النهائية والطباعة */}
        {step === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <div className="mb-6 flex justify-start no-print">
               <button 
                  onClick={() => setStep(2)}
                  className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold flex items-center gap-3"
               >
                 <ChevronRight className="w-4 h-4" />
                 تعديل الخيارات
               </button>
             </div>
             <PreviewView 
              students={students} 
              config={config} 
              documents={documents} 
              margins={margins} 
              setMargins={setMargins} 
             />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
