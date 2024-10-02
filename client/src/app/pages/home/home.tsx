import React from "react";
import { AIAssistant } from "../../components/ai-assistant";

export const Home: React.FC = () => {
  return (
    <>
      <AIAssistant viewing={`the dashboard`} />
      <div>Dashboard here</div>
    </>
  );
};
