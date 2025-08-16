import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getAgent } from "../api/axiosApi";

const TemplateContext = createContext();

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({ children }) => {
  const [template, setTemplate] = useState("template1");
  const [agent, setAgent] = useState(null);
  const [mainAgent, setMainAgent] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentInfo, setAgentInfo] = useState(null);

  const hasFetched = useRef(false); // 🛑 Prevent multiple fetches

  const switchTemplate = (newTemplate) => setTemplate(newTemplate);

  useEffect(() => {
    if (hasFetched.current) return; // Already fetched once? Skip.
    hasFetched.current = true;

    const fetchAgentData = async () => {
      try {
        const agentRes = await getAgent();
        setAgentInfo(agentRes.data.agent);
        setAgent(agentRes.data.domain.config);
        setMainAgent(agentRes.data.domain);
        setCategory(agentRes.data.domain.config.listing_category);
      } catch (error) {
        console.error("Error fetching agent:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        template,
        switchTemplate,
        agent,
        mainAgent,
        category,
        loading,
        agentInfo,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
