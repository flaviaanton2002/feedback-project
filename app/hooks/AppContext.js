"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext({});

export function AppContextProvider({ children }) {
  const [narrowHeader, setNarrowHeader] = useState(false);
  return (
    <AppContext.Provider value={{ narrowHeader, setNarrowHeader }}>
      {children}
    </AppContext.Provider>
  );
}

export function useNarrowHeader() {
  const { narrowHeader, setNarrowHeader } = useContext(AppContext);
  useEffect(() => {
    setNarrowHeader(true);
  }, []);
}

export function useWideHeader() {
  const { narrowHeader, setNarrowHeader } = useContext(AppContext);
  useEffect(() => {
    setNarrowHeader(false);
  }, []);
}
