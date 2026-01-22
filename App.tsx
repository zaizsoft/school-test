
import React, { useState, useCallback } from 'react';
import { 
  Edit3, 
  Settings, 
  BookOpen, 
  Users, 
  Eye, 
  FileUp, 
  Printer, 
  Info, 
  Zap,
  Image as ImageIcon,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Student, SchoolConfig, AppState } from './types';
import { FULL_CONFIG, TERM_MAPPING } from './constants';
import DocumentRenderer from './components/DocumentRenderer';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    students: [],
    config: {
      schoolName: "مدرسة الشهيد بني العربي",
      teacherName: "الزايز محمد الطاهر",
      academicYear: "2025/2026",
      level: "5",
      term: "الفصل الثاني",
      subLevel: "أ"
    },
    visiblePages: {
      diagnostic: true,
      achievement: true,
      performance: true,
      attendance: true,
      separator: false
    },
    signature: null
  });

  const [inputMethod, setInputMethod] = useState<'excel' | 'manual'>('excel');
  const [manualText, setManualText] = useState('');
  const [exemptText, setExemptText] = useState('');

  const updateConfig = (key: keyof SchoolConfig, value: string) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const newStudents: Student[] = [];
      for (let i = 8; i < data.length; i++) {
        const row = data[i];
        if (row && row[1]) {
          newStudents.push({
            id: newStudents.length + 1,
            name: `${row[1]} ${row[2] || ''}`.trim(),
            isExempted: false
          });
        }
      }
      setState(prev => ({ ...prev, students: newStudents }));
    };
    reader.readAsBinaryString(file);
  };

  const handleManualEntry = (text: string) => {
    setManualText(text);
    const names = text.split('\n').map(n => n.trim()).filter(n => n);
    const newStudents = names.map((name, idx) => ({
      id: idx + 1,
      name,
      isExempted: false
    }));
    setState(prev => ({ ...prev, students: newStudents }));
  };

  const applyExemptions = (text: string) => {
    setExemptText(text);
    const exemptIds = text.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => ({
        ...s,
        isExempted: exemptIds.includes(s.id)
      }))
    }));
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setState(prev => ({ ...prev, signature: evt.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePage = (page: keyof AppState['visiblePages']) => {
    setState(prev => ({
      ...prev,
      visiblePages: { ...prev.visiblePages, [page]: !prev.visiblePages[page] }
    }));
  };

  return (
    <div className="p-4 md:p-8">
      {/* Control Panel */}
      <div className="max-w-7xl mx-auto no-print bg-white p-6 rounded-2xl shadow-lg border mb-8 border-t-8 border-blue-600">
        <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-inner">
              <Edit3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">وضع التعديل والإعداد</h1>
              <p className="text-xs text-slate-500 font-bold">تغيير البيانات دون المساس بتصميم الوثائق</p>
            </div>
          </div>
          <div className="text-sm font-semibold bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
            <Info className="w-4 h-4" />
            تعديلات حية على المعاينة
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* General Settings */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-xs text-gray-700 border-b pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              بيانات الأستاذ والمؤسسة
            </h3>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase">اسم المؤسسة:</label>
              <input 
                type="text" 
                value={state.config.schoolName}
                onChange={e => updateConfig('schoolName', e.target.value)}
                className="w-full p-2 border rounded text-xs font-bold outline-none focus:ring-2 ring-blue-500" 
              />
              <label className="block text-[10px] font-bold text-gray-500 uppercase">اسم الأستاذ:</label>
              <input 
                type="text" 
                value={state.config.teacherName}
                onChange={e => updateConfig('teacherName', e.target.value)}
                className="w-full p-2 border rounded text-xs font-bold outline-none focus:ring-2 ring-blue-500" 
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-500">الموسم:</label>
                  <input 
                    type="text" 
                    value={state.config.academicYear}
                    onChange={e => updateConfig('academicYear', e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded text-xs font-bold outline-none" 
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-gray-500">الفوج:</label>
                  <select 
                    value={state.config.subLevel}
                    onChange={e => updateConfig('subLevel', e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded bg-white text-xs font-bold"
                  >
                    <option value="أ">أ</option>
                    <option value="ب">ب</option>
                    <option value="ج">ج</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Level & Term */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-xs text-blue-800 border-b border-blue-200 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              اختيار المستوى والفصل
            </h3>
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-blue-600 uppercase">المستوى الدراسي:</label>
              <select 
                value={state.config.level}
                onChange={e => updateConfig('level', e.target.value)}
                className="p-2.5 border border-blue-400 rounded-lg bg-white text-xs font-black w-full"
              >
                <option value="1">أولى إبتدائي</option>
                <option value="2">ثانية إبتدائي</option>
                <option value="3">ثالثة إبتدائي</option>
                <option value="4">رابعة إبتدائي</option>
                <option value="5">خامسة إبتدائي</option>
              </select>
              <label className="block text-[10px] font-bold text-blue-600 uppercase">الفصل الدراسي:</label>
              <select 
                value={state.config.term}
                onChange={e => updateConfig('term', e.target.value)}
                className="w-full p-2.5 border border-red-300 rounded-lg bg-white text-xs font-black"
              >
                <option value="الفصل الأول">الفصل الأول ({TERM_MAPPING['الفصل الأول']})</option>
                <option value="الفصل الثاني">الفصل الثاني ({TERM_MAPPING['الفصل الثاني']})</option>
                <option value="الفصل الثالث">الفصل الثالث ({TERM_MAPPING['الفصل الثالث']})</option>
              </select>
              <div className="p-2 bg-yellow-50 rounded border border-yellow-200 text-[10px] font-bold text-yellow-800 flex gap-1">
                <Zap className="w-3 h-3 flex-shrink-0" />
                تحديث تلقائي للكفاءات والمعايير.
              </div>
            </div>
          </div>

          {/* Students Management */}
          <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h3 className="font-bold text-xs text-purple-800 border-b border-purple-200 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              إدارة قائمة التلاميذ
            </h3>
            <div className="flex gap-1 mb-2">
              <button 
                onClick={() => setInputMethod('excel')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg ${inputMethod === 'excel' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >إكسال</button>
              <button 
                onClick={() => setInputMethod('manual')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg ${inputMethod === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >يدوي</button>
            </div>
            
            {inputMethod === 'excel' ? (
              <div className="space-y-2">
                <label className="w-full bg-white border-2 border-dashed border-blue-300 py-3 rounded-lg text-[10px] font-bold text-blue-700 flex items-center justify-center gap-2 hover:bg-blue-100 cursor-pointer">
                  <FileUp className="w-4 h-4" /> استيراد من الرقمنة
                  <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
                </label>
              </div>
            ) : (
              <textarea 
                value={manualText}
                onChange={e => handleManualEntry(e.target.value)}
                rows={3} 
                placeholder="الصق الأسماء هنا..." 
                className="w-full p-2 border border-purple-200 rounded text-[10px] font-bold outline-none"
              />
            )}

            <div className="pt-2 border-t border-purple-200">
              <label className="block text-[10px] font-bold text-purple-600 mb-1">أرقام التلاميذ المعفيين:</label>
              <input 
                type="text" 
                value={exemptText}
                onChange={e => applyExemptions(e.target.value)}
                placeholder="مثال: 1, 5, 12" 
                className="w-full p-2 border border-purple-300 rounded text-xs font-black outline-none"
              />
            </div>
          </div>

          {/* Visibility & Print */}
          <div className="space-y-3 bg-green-50 p-4 rounded-xl border border-green-100">
            <h3 className="font-bold text-xs text-green-800 border-b border-green-200 pb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600" />
              إدارة الصفحات والطباعة
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'diagnostic', label: 'التقويم التشخيصي' },
                { id: 'achievement', label: 'التقويم التحصيلي' },
                { id: 'performance', label: 'بطاقة أداء التلميذ' },
                { id: 'attendance', label: 'سجل المناداة' },
                { id: 'separator', label: 'إضافة ورقة فاصلة' }
              ].map(page => (
                <label key={page.id} className="flex items-center gap-2 p-1.5 bg-white/50 rounded-lg border border-slate-200 cursor-pointer hover:bg-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={state.visiblePages[page.id as keyof AppState['visiblePages']]} 
                    onChange={() => togglePage(page.id as any)}
                    className="w-4 h-4 accent-green-600" 
                  />
                  <span className="text-[10px] font-bold">{page.label}</span>
                </label>
              ))}
            </div>
            <button 
              onClick={() => window.print()}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-black shadow-lg hover:bg-green-700 transition-all text-xs flex items-center justify-center gap-2 mt-2"
            >
              <Printer className="w-4 h-4" />
              طباعة المختارة
            </button>
          </div>
        </div>
      </div>

      {/* Documents Render Area */}
      <div className="flex flex-col items-center gap-12 bg-slate-900 -mx-4 -mb-8 p-12 no-print-bg">
        <DocumentRenderer state={state} onSignatureUpload={handleSignatureUpload} />
      </div>
    </div>
  );
};

export default App;
