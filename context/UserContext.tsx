// context/UserContext.tsx
import React, { createContext, ReactNode, useState } from 'react';

type User = {
  full_name: string;
  email: string;
  role: string;
  phone: string;

  // if role == 'mechanic'
  experience_years?: number;
  specialization?: string;
  affiliated_to?: string;

  // file
  citizenship_doc?: any;
  license_doc?: any;
  company_affiliation_doc?: any;
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    full_name: '',
    email: '',
    role: '',
    phone: '',
    experience_years: 0,
    specialization: '',
    // optional docs set later via setUser
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
