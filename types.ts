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

export interface EmergentConstraint {
  id: string;
  rule: string;
  justification: string;
}

export interface EscrowedMessage extends Message {
  evaluation: {
    cfdi: number;
    bai: number;
    reasoning: string;
  };
  escrowReason: string;
}

export interface BettiLoopState {
  isLoopDetected: boolean;
  bettiLoopLevel: number;
  lastEscrowedAgent: ModelId | null;
}
