
// تعريف أنواع البيانات الأساسية للتطبيق
export interface Student {
  id: number;
  name: string;
  isExempted: boolean;
}

export interface SchoolConfig {
  schoolName: string;
  level: string;
  subLevel: string;
  teacherName: string;
  academicYear: string;
  term: string;
}

export interface DocumentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  selected: boolean;
}

export interface MarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
  verticalOffset: number;
}
