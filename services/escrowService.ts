import { Message, ModelId, BettiLoopState, EscrowedMessage } from '../types';

export const ESCROW_CFDI_THRESHOLD = 15;

export function processMessageForEscrow(
    message: Message,
    evaluation: { cfdi: number; bai: number; reasoning: string }
): { isEscrowed: boolean; escrowReason?: string; escrowedMessage?: EscrowedMessage } {
    if (evaluation.cfdi > ESCROW_CFDI_THRESHOLD) {
        return {
            isEscrowed: true,
            escrowReason: `CFDI exceeded threshold (${evaluation.cfdi} > ${ESCROW_CFDI_THRESHOLD}). Message sequestered in Epistemic Escrow.`,
            escrowedMessage: {
                ...message,
                evaluation,
                escrowReason: `CFDI exceeded threshold (${evaluation.cfdi} > ${ESCROW_CFDI_THRESHOLD}).`
            }
        };
    }

    return { isEscrowed: false };
}

export class BettiLoopDetector {
    private state: BettiLoopState = {
        isLoopDetected: false,
        bettiLoopLevel: 0,
        lastEscrowedAgent: null
    };

    registerEscrow(agentId: ModelId, turn: number): BettiLoopState {
        if (this.state.lastEscrowedAgent === agentId) {
            this.state.isLoopDetected = true;
            this.state.bettiLoopLevel += 1;
        } else {
            this.state.isLoopDetected = false;
            this.state.bettiLoopLevel = 0;
            this.state.lastEscrowedAgent = agentId;
        }
        return { ...this.state };
    }

    resetLoop(): void {
        this.state = {
            isLoopDetected: false,
            bettiLoopLevel: 0,
            lastEscrowedAgent: null
        };
    }

    getState(): BettiLoopState {
        return { ...this.state };
    }
}
