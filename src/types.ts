export interface BPKFinding {
  id: string;
  code: string;
  title: string;
  description: string;
  amount?: number;
  status: 'pending' | 'addressed' | 'critical';
  recommendation: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: 'Document' | 'Data' | 'Strategy';
}

export interface RDPState {
  findings: BPKFinding[];
  checklist: ChecklistItem[];
}
