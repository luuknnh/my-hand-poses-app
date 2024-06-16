import React from "react";

interface AnimationContextType {
  routeVariants: {
    initial: {
      y: string;
      opacity: number;
    };
    final: {
      y: string;
      opacity: number;
      transition: {
        duration: number;
      };
    };
  };
}

const AnimationContext = React.createContext<AnimationContextType | undefined>(
  undefined
);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const routeVariants = {
    initial: {
      y: "10%",
      opacity: 0,
    },
    final: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimationContext.Provider
      value={{
        routeVariants,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => {
  const context = React.useContext(AnimationContext);
  if (context === undefined) {
    throw new Error(
      "useAnimationContext must be used within a AnimationContext"
    );
  }
  return context;
};
