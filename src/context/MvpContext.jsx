import { createContext, useContext, useState, useEffect } from 'react';

const MvpContext = createContext(null);

export function MvpProvider({ children }) {
  const [mvpUnlocked, setMvpUnlocked] = useState(() => {
    return localStorage.getItem('got_mvp_unlocked') === 'true';
  });

  const unlock = () => {
    setMvpUnlocked(true);
    localStorage.setItem('got_mvp_unlocked', 'true');
  };

  return (
    <MvpContext.Provider value={{ mvpUnlocked, unlock }}>
      {children}
    </MvpContext.Provider>
  );
}

export function useMvp() {
  const context = useContext(MvpContext);
  if (!context) throw new Error('useMvp must be used within MvpProvider');
  return context;
}
