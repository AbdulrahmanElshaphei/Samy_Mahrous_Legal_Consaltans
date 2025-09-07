export interface UploadTemplateResponse {
  templateId: any;   // ممكن تغيّر any لـ number أو string لو عارف النوع
  template: any;     // نفس الكلام، غيّر النوع لو عارف شكل البيانات
  userId: string;
  filePath: string;
  createdAt: string; // تاريخ بصيغة ISO
  id: number;
}
