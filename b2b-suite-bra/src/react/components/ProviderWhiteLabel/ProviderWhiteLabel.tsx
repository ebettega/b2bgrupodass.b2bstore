import React, { createContext, useContext, useState } from "react";

interface ContextProps {
  seller: string;
  setSeller: React.Dispatch<React.SetStateAction<string>>;
}

const ProviderWhiteLabelContext = createContext({} as ContextProps);

export default function ProviderWhiteLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seller, setSeller] = useState("1");

  return (
    <ProviderWhiteLabelContext.Provider
      value={{
        seller,
        setSeller,
      }}
    >
      {children}
    </ProviderWhiteLabelContext.Provider>
  );
}

export const useProviderWhiteLabel = () => {
  return useContext(ProviderWhiteLabelContext);
};
