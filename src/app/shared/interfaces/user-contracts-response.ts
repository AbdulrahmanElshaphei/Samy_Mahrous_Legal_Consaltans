// export type UserContractsResponse = UserContractItem[];

export interface UserContractItem {
  templateId: any;   // غيّر any لـ number أو string لو عارف النوع
  template: any;     // غيّر any لـ object أو interface لو عارف شكله
  userId: string;
  filePath: string;
  createdAt: string; // تاريخ بصيغة ISO
  id: number;
}
