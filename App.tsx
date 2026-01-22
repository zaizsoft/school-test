
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, 
  ChevronLeft, 
  ChevronRight, 
  FileUp, 
  Settings2, 
  Printer, 
  X, 
  Info,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Step, Student, SchoolConfig, DocumentType, MarginSettings } from './types';
import { TERM_MAPPING, PEDAGOGICAL_CONFIG, INITIAL_DOCUMENTS } from './constants';
import DataView from './components/DataView';
import CustomizationView from './components/CustomizationView';
import PreviewView from './components/PreviewView';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.DATA);
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<SchoolConfig>({
    schoolName: 'مدرسة الشهيد بني العربي (قمار)',
    teacherName: 'الأستاذ الزايز محمد الطاهر',
    academicYear: '2024-2025',
    level: '5',
    term: 'الفصل الأول',
    field: TERM_MAPPING['الفصل الأول'],
    subLevel: 'أ'
  });
  const [documents, setDocuments] = useState<DocumentType[]>(INITIAL_DOCUMENTS);
  const [margins, setMargins] = useState<MarginSettings>({
    top: 10,
    bottom: 10,
    right: 15,
    left: 15,
    verticalOffset: 0
  });

  const handleNext = () => {
    if (currentStep === Step.DATA) setCurrentStep(Step.CUSTOMIZE);
    else if (currentStep === Step.CUSTOMIZE) setCurrentStep(Step.PREVIEW);
  };

  const handleBack = () => {
    if (currentStep === Step.CUSTOMIZE) setCurrentStep(Step.DATA);
    else if (currentStep === Step.PREVIEW) setCurrentStep(Step.CUSTOMIZE);
  };

  const handleStudentToggle = (id: number) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, isExempted: !s.isExempted } : s
    ));
  };

  const resetData = () => {
    if(confirm('هل أنت متأكد من مسح كافة البيانات؟')) {
      setStudents([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-200">
              <Layout className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">منصة الإدارة التربوية</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">نظام معالجة وتوليد الوثائق الرسمية</p>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100 p-1 rounded-full border border-slate-200">
            <button 
              onClick={() => setCurrentStep(Step.DATA)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${currentStep === Step.DATA ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              البيانات
            </button>
            <button 
              onClick={() => setCurrentStep(Step.CUSTOMIZE)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${currentStep === Step.CUSTOMIZE ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              تخصيص
            </button>
            <button 
              onClick={() => setCurrentStep(Step.PREVIEW)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${currentStep === Step.PREVIEW ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              معاينة وطباعة
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-bold text-slate-400">تواصل مع الدعم</p>
              <p className="text-xs font-bold text-slate-700">0772839401</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className={`transition-all duration-500 ease-in-out ${currentStep === Step.PREVIEW ? 'w-full' : 'bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 min-h-[70vh] p-8'}`}>
          {currentStep === Step.DATA && (
            <DataView 
              students={students} 
              setStudents={setStudents}
              config={config}
              setConfig={setConfig}
              onToggleExempt={handleStudentToggle}
              onReset={resetData}
            />
          )}
          {currentStep === Step.CUSTOMIZE && (
            <CustomizationView 
              documents={documents}
              setDocuments={setDocuments}
            />
          )}
          {currentStep === Step.PREVIEW && (
            <PreviewView 
              students={students}
              config={config}
              documents={documents}
              margins={margins}
              setMargins={setMargins}
            />
          )}
        </div>
      </main>

      {/* Sticky Bottom Nav */}
      <footer className="sticky bottom-4 z-50 px-4 max-w-3xl mx-auto w-full no-print">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-full p-3 flex items-center justify-between">
          <button 
            onClick={handleBack}
            disabled={currentStep === Step.DATA}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${currentStep === Step.DATA ? 'opacity-20 cursor-not-allowed text-slate-400' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ChevronRight className="w-5 h-5" />
            المرحلة السابقة
          </button>

          <div className="flex gap-2">
             <div className="flex items-center gap-1 px-3">
               {[Step.DATA, Step.CUSTOMIZE, Step.PREVIEW].map((s, idx) => (
                 <div 
                   key={s}
                   className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === s ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                 />
               ))}
             </div>
          </div>

          <button 
            onClick={handleNext}
            disabled={currentStep === Step.PREVIEW}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all ${currentStep === Step.PREVIEW ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
          >
            الاستمرار
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
