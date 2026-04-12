
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModelId, Message, Model, LearningDataPoint } from './types';
import { splitTask, generateResponse, evaluateContribution } from './services/geminiService';
import Header from './components/Header';
import TaskInputForm from './components/TaskInputForm';
import ModelColumn from './components/ModelColumn';
import LearningProgressChart from './components/LearningProgressChart';

const MAX_TURNS = 10;

const App: React.FC = () => {
  const [task, setTask] = useState<string>('');
  const [models, setModels] = useState<Record<ModelId, Model>>({
    [ModelId.A]: { id: ModelId.A, name: 'Model A', fragment: '', knowledgeScore: 0 },
    [ModelId.B]: { id: ModelId.B, name: 'Model B', fragment: '', knowledgeScore: 0 },
  });
  const [conversation, setConversation] = useState<Message[]>([]);
  const [learningHistory, setLearningHistory] = useState<LearningDataPoint[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [activeModel, setActiveModel] = useState<ModelId>(ModelId.A);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSimulatingRef = useRef(isSimulating);
  useEffect(() => {
    isSimulatingRef.current = isSimulating;
  }, [isSimulating]);

  const resetState = () => {
    setTask('');
    setModels({
      [ModelId.A]: { id: ModelId.A, name: 'Model A', fragment: '', knowledgeScore: 0 },
      [ModelId.B]: { id: ModelId.B, name: 'Model B', fragment: '', knowledgeScore: 0 },
    });
    setConversation([]);
    setLearningHistory([]);
    setCurrentTurn(0);
    setActiveModel(ModelId.A);
    setIsLoading(false);
    setIsSimulating(false);
    setError(null);
  }

  const handleTaskSubmit = async (submittedTask: string) => {
    resetState();
    setIsLoading(true);
    setError(null);
    try {
      setTask(submittedTask);
      const { fragmentA, fragmentB } = await splitTask(submittedTask);
      setModels({
        [ModelId.A]: { id: ModelId.A, name: 'Model A', fragment: fragmentA, knowledgeScore: 10 },
        [ModelId.B]: { id: ModelId.B, name: 'Model B', fragment: fragmentB, knowledgeScore: 10 },
      });
      setLearningHistory([{ turn: 0, modelAScore: 10, modelBScore: 10 }]);
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
        setConversation(prev => [...prev, { sender: 'system', content: 'Simulation complete. Maximum turns reached.', turn: currentTurn }]);
      }
      return;
    }
  
    const conversationText = conversation.map(m => `${m.sender === 'system' ? 'SYSTEM' : `Model ${m.sender}`}: ${m.content}`).join('\n');
    const modelToAct = models[activeModel];
  
    try {
      const responseContent = await generateResponse(modelToAct.name, modelToAct.fragment, conversationText);
      const newMessage: Message = { sender: activeModel, content: responseContent, turn: currentTurn };
      setConversation(prev => [...prev, newMessage]);
  
      const updatedConversationText = `${conversationText}\nModel ${activeModel}: ${responseContent}`;
      const { score } = await evaluateContribution(task, updatedConversationText);
  
      setModels(prevModels => ({
        ...prevModels,
        [activeModel]: {
          ...prevModels[activeModel],
          knowledgeScore: Math.min(100, prevModels[activeModel].knowledgeScore + score),
        }
      }));
      
      setLearningHistory(prev => {
          const newScores = {
              modelAScore: activeModel === ModelId.A ? Math.min(100, models[ModelId.A].knowledgeScore + score) : models[ModelId.A].knowledgeScore,
              modelBScore: activeModel === ModelId.B ? Math.min(100, models[ModelId.B].knowledgeScore + score) : models[ModelId.B].knowledgeScore,
          };
          return [...prev, { turn: currentTurn, ...newScores }];
      });
  
      setActiveModel(prev => (prev === ModelId.A ? ModelId.B : ModelId.A));
      setCurrentTurn(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during simulation.');
      setIsSimulating(false);
    }
  }, [activeModel, conversation, currentTurn, models, task]);

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
        
        {conversation.find(m => m.sender === 'system') && (
             <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg text-center">
                <h3 className="text-xl font-semibold text-brand-accent">Simulation Log</h3>
                <p className="text-brand-text-secondary mt-2">{conversation.find(m => m.sender === 'system')?.content}</p>
                <button
                  onClick={resetState}
                  className="mt-4 bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition duration-200"
                >
                  Start New Simulation
                </button>
             </div>
        )}

      </main>
      <footer className="text-center p-4 text-brand-text-secondary text-sm border-t border-brand-border">
        <p>Cogni-Forge AI &copy; 2024. A conceptual demonstration.</p>
      </footer>
    </div>
  );
};

export default App;
