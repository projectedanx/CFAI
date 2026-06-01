
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModelId, Message, Model, LearningDataPoint, SymbolicScar, EmergentConstraint, EscrowedMessage } from './types';
import { processMessageForEscrow, BettiLoopDetector } from './services/escrowService';
import { splitTask, generateResponse, evaluateContribution, synthesizeConstraint } from './services/geminiService';
import Header from './components/Header';
import TaskInputForm from './components/TaskInputForm';
import ModelColumn from './components/ModelColumn';
import LearningProgressChart from './components/LearningProgressChart';

const MAX_TURNS = 10;

const App: React.FC = () => {
  const [task, setTask] = useState<string>('');
  const [models, setModels] = useState<Record<ModelId, Model>>({
    [ModelId.A]: { id: ModelId.A, name: 'Agent Alpha', lens: '' },
    [ModelId.B]: { id: ModelId.B, name: 'Agent Beta', lens: '' },
  });
  const [conversation, setConversation] = useState<Message[]>([]);
  const [learningHistory, setLearningHistory] = useState<LearningDataPoint[]>([]);
  const [symbolicScars, setSymbolicScars] = useState<SymbolicScar[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [activeModel, setActiveModel] = useState<ModelId>(ModelId.A);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingIntervention, setAwaitingIntervention] = useState<boolean>(false);
  const [humanInput, setHumanInput] = useState<string>('');
  const [activeConstraints, setActiveConstraints] = useState<EmergentConstraint[]>([]);
  const [escrowedMessages, setEscrowedMessages] = useState<EscrowedMessage[]>([]);
  const [bettiLoopState, setBettiLoopState] = useState<{isLoopDetected: boolean, bettiLoopLevel: number}>({isLoopDetected: false, bettiLoopLevel: 0});
  const bettiDetectorRef = useRef(new BettiLoopDetector());


  const isSimulatingRef = useRef(isSimulating);
  useEffect(() => {
    isSimulatingRef.current = isSimulating;
  }, [isSimulating]);

  const resetState = () => {
    setTask('');
    setModels({
      [ModelId.A]: { id: ModelId.A, name: 'Agent Alpha', lens: '' },
      [ModelId.B]: { id: ModelId.B, name: 'Agent Beta', lens: '' },
    });
    setConversation([]);
    setLearningHistory([]);
    setSymbolicScars([]);
    setCurrentTurn(0);
    setActiveModel(ModelId.A);
    setIsLoading(false);
    setIsSimulating(false);
    setError(null);
    setAwaitingIntervention(false);
    setHumanInput('');
    setActiveConstraints([]);
    setEscrowedMessages([]);
    bettiDetectorRef.current.resetLoop();
    setBettiLoopState({isLoopDetected: false, bettiLoopLevel: 0});
  }


  const handleTaskSubmit = async (submittedTask: string) => {
    resetState();
    setIsLoading(true);
    setError(null);
    try {
      setTask(submittedTask);
      const { lensA, lensB } = await splitTask(submittedTask);
      setModels({
        [ModelId.A]: { id: ModelId.A, name: 'Agent Alpha', lens: lensA },
        [ModelId.B]: { id: ModelId.B, name: 'Agent Beta', lens: lensB },
      });
      setLearningHistory([{ turn: 0, cfdi: 0, bai: 0 }]);
      setCurrentTurn(1);
      setIsSimulating(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const runSimulationTurn = useCallback(async () => {
    if (!isSimulatingRef.current || currentTurn > MAX_TURNS) {
      if (isSimulatingRef.current) {
        setIsSimulating(false);
        setConversation(prev => [...prev, { sender: 'system', content: 'Collaboration sequence complete. Maximum turns reached.', turn: currentTurn }]);
      }
      return;
    }
  
    const conversationText = conversation.map(m => `${m.sender === 'system' ? 'SYSTEM' : m.sender === 'human' ? 'SYSTEM: [HUMAN INTERVENTION]' : `Agent ${m.sender}`}: ${m.content}`).join('\n');
    const modelToAct = models[activeModel];
  
    try {
      const responseContent = await generateResponse(modelToAct.name, modelToAct.lens, conversationText, activeConstraints);
      const newMessage: Message = { sender: activeModel, content: responseContent, turn: currentTurn };

      const updatedConversationText = `${conversationText}\nAgent ${activeModel}: ${responseContent}`;
      const evaluation = await evaluateContribution(task, updatedConversationText);
      const { cfdi, bai, reasoning } = evaluation;

      setLearningHistory(prev => [...prev, { turn: currentTurn, cfdi, bai }]);

      const escrowResult = processMessageForEscrow(newMessage, evaluation);

      if (escrowResult.isEscrowed && escrowResult.escrowedMessage) {
        setEscrowedMessages(prev => [...prev, escrowResult.escrowedMessage!]);

        const loopState = bettiDetectorRef.current.registerEscrow(activeModel, currentTurn);
        setBettiLoopState({
            isLoopDetected: loopState.isLoopDetected,
            bettiLoopLevel: loopState.bettiLoopLevel
        });

        setIsSimulating(false);
        setAwaitingIntervention(true); // Treat escrow as needing intervention
        return;
      }

      // If not escrowed, add to conversation and reset loop detector
      setConversation(prev => [...prev, newMessage]);
      bettiDetectorRef.current.resetLoop();
      setBettiLoopState({isLoopDetected: false, bettiLoopLevel: 0});

      if (bai > 70) {
        setSymbolicScars(prev => [...prev, {
            id: `scar-${currentTurn}-${Date.now()}`,
            turn: currentTurn,
            bai,
            reasoning
        }]);
        setAwaitingIntervention(true);
        setIsSimulating(false);
        return;
      }
  
      setActiveModel(prev => (prev === ModelId.A ? ModelId.B : ModelId.A));
      setCurrentTurn(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during simulation.');
      setIsSimulating(false);
    }
  }, [activeModel, conversation, currentTurn, models, task]);



  const handleDebridement = (messageIndex: number, action: 'inject' | 'discard') => {
    const messageToProcess = escrowedMessages[messageIndex];

    if (action === 'inject') {
        // Human applies Golden Scar Protocol (weight 1.618) and injects the divergent thought
        setConversation(prev => [...prev, {
            sender: messageToProcess.sender,
            content: `[GOLDEN SCAR INJECTION: ${messageToProcess.content}]`,
            turn: messageToProcess.turn
        }]);
    }

    // Remove from escrow
    setEscrowedMessages(prev => prev.filter((_, idx) => idx !== messageIndex));
    setAwaitingIntervention(false);
    setIsSimulating(true);

    // Increment turn and switch agent as if turn completed normally (if injected) or to try again (if discarded)
    if(action === 'inject'){
       setActiveModel(prev => (prev === ModelId.A ? ModelId.B : ModelId.A));
       setCurrentTurn(prev => prev + 1);
    }
  };

  const handleHumanInterventionSubmit = async () => {
    if (!humanInput.trim()) return;
    setConversation(prev => [...prev, { sender: 'human', content: humanInput, turn: currentTurn }]);
    setAwaitingIntervention(false);
    setIsSimulating(true);

    const conversationText = conversation.map(m => `${m.sender === 'system' ? 'SYSTEM' : m.sender === 'human' ? 'SYSTEM: [HUMAN INTERVENTION]' : `Agent ${m.sender}`}: ${m.content}`).join('\n');
    try {
      const constraint = await synthesizeConstraint(humanInput, conversationText);
      setActiveConstraints(prev => [...prev, {
          id: `constraint-${currentTurn}-${Date.now()}`,
          rule: constraint.rule,
          justification: constraint.justification
      }]);
    } catch (err) {
      console.error("Failed to synthesize constraint", err);
    }

    setHumanInput('');
  };

  useEffect(() => {
    if (isSimulating && currentTurn > 0 && currentTurn <= MAX_TURNS) {
      const timer = setTimeout(() => {
        runSimulationTurn();
      }, 2000); 
      return () => clearTimeout(timer);
    } else if (currentTurn > MAX_TURNS) {
        setIsSimulating(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating, currentTurn, runSimulationTurn]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 container mx-auto space-y-8">
        <TaskInputForm onSubmit={handleTaskSubmit} isLoading={isLoading} isSimulating={isSimulating} />
        
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ModelColumn 
            model={models.A} 
            messages={conversation.filter(m => m.sender === ModelId.A)}
            isThinking={isSimulating && activeModel === ModelId.A}
          />
          <ModelColumn 
            model={models.B} 
            messages={conversation.filter(m => m.sender === ModelId.B)}
            isThinking={isSimulating && activeModel === ModelId.B}
          />
        </div>
        

                <LearningProgressChart data={learningHistory} />

        {activeConstraints.length > 0 && (
          <div className="bg-brand-surface rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-brand-accent mb-4">Active Structural Constraints</h3>
            <ul className="space-y-4">
                {activeConstraints.map(constraint => (
                    <li key={constraint.id} className="p-4 bg-brand-bg border border-brand-border rounded-lg">
                        <div className="flex justify-between text-sm text-brand-text-primary mb-2">
                            <strong>Rule:</strong> {constraint.rule}
                        </div>
                        <p className="text-brand-text-secondary text-sm">Justification: {constraint.justification}</p>
                    </li>
                ))}
            </ul>
          </div>
        )}

        {escrowedMessages.length > 0 && awaitingIntervention && (
            <div className="bg-brand-surface border border-purple-600 rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Epistemic Escrow Quarantine</h3>
              <p className="text-brand-text-secondary mb-4">
                A high Confidence-Fidelity Divergence Index (CFDI) has been detected. The message has been sequestered.
                Apply Human Debridement (Golden Scar Protocol) to resolve.
              </p>

              {bettiLoopState.isLoopDetected && (
                  <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
                      <strong>🚨 Betti Loop Detected (Level {bettiLoopState.bettiLoopLevel})!</strong>
                      The same agent is repeatedly producing high-divergence output, indicating a persistent topological conflict.
                  </div>
              )}

              <ul className="space-y-4">
                  {escrowedMessages.map((msg, idx) => (
                      <li key={idx} className="p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
                          <div className="flex justify-between text-sm text-purple-300 mb-2">
                              <span>Agent {msg.sender} (Turn {msg.turn})</span>
                              <span>CFDI: {msg.evaluation.cfdi}</span>
                          </div>
                          <p className="text-brand-text-primary text-sm mb-2">{msg.content}</p>
                          <p className="text-brand-text-secondary text-xs italic mb-4">Reasoning: {msg.evaluation.reasoning}</p>
                          <div className="flex space-x-4">
                              <button
                                onClick={() => handleDebridement(idx, 'inject')}
                                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md transition"
                              >
                                  Inject (Golden Scar)
                              </button>
                              <button
                                onClick={() => handleDebridement(idx, 'discard')}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md transition"
                              >
                                  Discard & Retry
                              </button>
                          </div>
                      </li>
                  ))}
              </ul>
            </div>
        )}

        {escrowedMessages.length === 0 && awaitingIntervention && (
          <div className="bg-brand-surface border border-yellow-600 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">Epistemic Mirror Trap Detected (BAI &gt; 70)</h3>
            <p className="text-brand-text-secondary mb-4">
              The agents are converging too quickly on a standard paradigm, risking Epistemic Monoculture.
              Provide a Context-Mediated Domain Adaptation (Human Intervention) to inject ground truth or a divergent perspective.
            </p>
            <textarea
              className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text-primary focus:outline-none focus:border-brand-accent mb-4"
              rows={4}
              placeholder="Inject tacit knowledge or redirect the ontological trajectory..."
              value={humanInput}
              onChange={(e) => setHumanInput(e.target.value)}
            />
            <button
              onClick={handleHumanInterventionSubmit}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Inject Context & Resume Simulation
            </button>
          </div>
        )}

        {symbolicScars.length > 0 && (
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Symbolic Scars (BAI &gt; 70)</h3>
            <ul className="space-y-4">
                {symbolicScars.map(scar => (
                    <li key={scar.id} className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                        <div className="flex justify-between text-sm text-red-300 mb-2">
                            <span>Turn: {scar.turn}</span>
                            <span>BAI: {scar.bai}</span>
                        </div>
                        <p className="text-brand-text-primary text-sm">{scar.reasoning}</p>
                    </li>
                ))}
            </ul>
          </div>
        )}
        
        {conversation.find(m => m.sender === 'system') && (
             <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg text-center">
                <h3 className="text-xl font-semibold text-brand-accent">Simulation Log</h3>
                <p className="text-brand-text-secondary mt-2">{conversation.find(m => m.sender === 'system')?.content}</p>
                <button
                  onClick={resetState}
                  className="mt-4 bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition duration-200"
                >
                  Start New Collaboration
                </button>
             </div>
        )}

      </main>
      <footer className="text-center p-4 text-brand-text-secondary text-sm border-t border-brand-border">
        <p>Epistemic Cartographer &copy; 2024. Preventing Epistemic Monoculture.</p>
      </footer>
    </div>
  );
};

export default App;
