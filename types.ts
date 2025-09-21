
export interface DomainAnalysis {
  domainName: string;
  brandArchetype: string;
  atomScore: number;
  linguisticAnalysis: string;
  keyStrengths: string;
  weaknessesOrRisks: string;
  idealUseCases: string;
  valuation: string;
}

export interface ExecutivePick {
  rank: number;
  domainName: string;
  justification: string;
}

export interface DomainReport {
  analysisTable: DomainAnalysis[];
  executiveBriefing: ExecutivePick[];
}
