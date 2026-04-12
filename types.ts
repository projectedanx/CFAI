
export enum ModelId {
  A = 'A',
  B = 'B',
}

export interface Message {
  sender: ModelId | 'system';
  content: string;
  turn: number;
}

export interface Model {
  id: ModelId;
  name: string;
  fragment: string;
  knowledgeScore: number;
}

export interface LearningDataPoint {
  turn: number;
  modelAScore: number;
  modelBScore: number;
}
