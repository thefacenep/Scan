import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Feedback } from '../types';

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Feedback) => void;
  updateResponse: (id: string, response: string) => void;
  findByCode: (code: string) => Feedback | undefined;
}

const FeedbackContext = createContext<FeedbackContextType>({
  feedbacks: [],
  addFeedback: () => {},
  updateResponse: () => {},
  findByCode: () => undefined,
});

function loadFeedbacks(): Feedback[] {
  try {
    const data = localStorage.getItem('iro-feedbacks');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveFeedbacks(feedbacks: Feedback[]) {
  localStorage.setItem('iro-feedbacks', JSON.stringify(feedbacks));
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(loadFeedbacks);

  const addFeedback = useCallback((feedback: Feedback) => {
    setFeedbacks(prev => {
      const updated = [feedback, ...prev];
      saveFeedbacks(updated);
      return updated;
    });
  }, []);

  const updateResponse = useCallback((id: string, response: string) => {
    setFeedbacks(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, response } : f);
      saveFeedbacks(updated);
      return updated;
    });
  }, []);

  const findByCode = useCallback((code: string) => {
    return feedbacks.find(f => f.code === code);
  }, [feedbacks]);

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, updateResponse, findByCode }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);
