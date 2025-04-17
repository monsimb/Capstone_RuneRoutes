import React, { createContext, useState, useContext } from 'react';

type ProfileContextType = {
  totalExploredArea: number;
  setTotalExploredArea: React.Dispatch<React.SetStateAction<number>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalExploredArea, setTotalExploredArea] = useState(0);

  return (
    <ProfileContext.Provider value={{ totalExploredArea, setTotalExploredArea }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};