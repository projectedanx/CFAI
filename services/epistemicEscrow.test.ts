import { describe, it, expect } from 'vitest';
import { processMessageForEscrow, BettiLoopDetector } from './escrowService';
import { ModelId } from '../types';

describe('Epistemic Escrow Service', () => {
    it('should quarantine messages with CFDI > 15', () => {
        const message = {
            sender: ModelId.A,
            content: 'High divergence claim',
            turn: 1
        };
        const evaluation = { cfdi: 18, bai: 20, reasoning: 'Divergent' };

        const result = processMessageForEscrow(message, evaluation);

        expect(result.isEscrowed).toBe(true);
        expect(result.escrowReason).toContain('CFDI exceeded threshold');
    });

    it('should not quarantine messages with CFDI <= 15', () => {
        const message = {
            sender: ModelId.B,
            content: 'Low divergence claim',
            turn: 2
        };
        const evaluation = { cfdi: 10, bai: 20, reasoning: 'Convergent' };

        const result = processMessageForEscrow(message, evaluation);

        expect(result.isEscrowed).toBe(false);
    });
});

describe('Betti Loop Detector', () => {
    it('should detect a Betti Loop if the same agent has consecutive escrows', () => {
        const detector = new BettiLoopDetector();

        const result1 = detector.registerEscrow(ModelId.A, 1);
        expect(result1.isLoopDetected).toBe(false);

        const result2 = detector.registerEscrow(ModelId.A, 2);
        expect(result2.isLoopDetected).toBe(true);
        expect(result2.bettiLoopLevel).toBe(1);
    });

    it('should reset Betti Loop if a different agent is escrowed or a successful turn occurs', () => {
        const detector = new BettiLoopDetector();

        detector.registerEscrow(ModelId.A, 1);
        const result1 = detector.registerEscrow(ModelId.B, 2);
        expect(result1.isLoopDetected).toBe(false);

        detector.registerEscrow(ModelId.B, 3); // Beta loop
        detector.resetLoop();
        const result2 = detector.registerEscrow(ModelId.B, 4);
        expect(result2.isLoopDetected).toBe(false);
    });
});
