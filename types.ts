export enum ModelId {
  A = 'A',
  B = 'B',
}

export interface Message {
  sender: ModelId | 'system' | 'human';
  content: string;
  turn: number;
}

export interface Model {
  id: ModelId;
  name: string;
  lens: string;
}

export interface LearningDataPoint {
  turn: number;
  cfdi: number;
  bai: number;
}

export interface SymbolicScar {
  id: string;
  turn: number;
  bai: number;
  reasoning: string;
}
