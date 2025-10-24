import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  // Start loading for a specific key with a message
  const startLoading = useCallback((key = 'global', message = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { 
        active: true, 
        message,
        startTime: Date.now()
      }
    }));
  }, []);

  // Stop loading for a specific key
  const stopLoading = useCallback((key = 'global') => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  // Update loading message during operation
  const updateLoadingMessage = useCallback((key = 'global', message) => {
    setLoadingStates(prev => {
      if (!prev[key]) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], message }
      };
    });
  }, []);

  const value = useMemo(() => ({
    startLoading,
    stopLoading,
    updateLoadingMessage,
    loadingStates,
    hasActiveLoading: Object.keys(loadingStates).length > 0
  }), [startLoading, stopLoading, updateLoadingMessage, loadingStates]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook for component-level loading state
export const useLoading = (key) => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }

  const { startLoading, stopLoading, updateLoadingMessage, loadingStates } = context;

  return useMemo(() => ({
    start: (message) => startLoading(key, message),
    stop: () => stopLoading(key),
    updateMessage: (message) => updateLoadingMessage(key, message),
    isLoading: !!loadingStates[key]?.active,
    message: loadingStates[key]?.message || 'Loading...',
    duration: loadingStates[key]?.startTime ? Date.now() - loadingStates[key].startTime : 0,
    // Wrap async function with loading state
    withLoading: async (fn, message) => {
      startLoading(key, message);
      try {
        return await fn();
      } finally {
        stopLoading(key);
      }
    }
  }), [key, startLoading, stopLoading, updateLoadingMessage, loadingStates]);
};

// Hook for accessing global loading states
export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
};
