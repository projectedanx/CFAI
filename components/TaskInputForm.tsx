
import React, { useState } from 'react';

interface TaskInputFormProps {
  onSubmit: (task: string) => void;
  isLoading: boolean;
  isSimulating: boolean;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({ onSubmit, isLoading, isSimulating }) => {
  const [task, setTask] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task.trim());
    }
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <label htmlFor="task-input" className="block text-lg font-semibold mb-2 text-brand-text-primary">
          Enter a Complex Task or Question
        </label>
        <textarea
          id="task-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g., Explain the process of photosynthesis and its importance for life on Earth."
          className="w-full h-28 p-3 bg-brand-bg border border-brand-border rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition duration-200"
          disabled={isLoading || isSimulating}
        />
        <button
          type="submit"
          disabled={isLoading || isSimulating || !task.trim()}
          className="mt-4 w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Initializing...
            </>
          ) : (
            'Start Emergent Learning'
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskInputForm;
