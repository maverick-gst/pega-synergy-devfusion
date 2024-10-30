import { StateGraph, END } from "@langchain/langgraph/web";
import { StateAnnotation } from './state';
import { initialSupport, billingSupport, technicalSupport } from './nodes';

const workflow = new StateGraph(StateAnnotation)
  .addNode("initial_support", initialSupport)
  .addNode("billing_support", billingSupport)
  .addNode("technical_support", technicalSupport)
  .setEntryPoint("initial_support")
  .addConditionalEdges(
    "initial_support",
    (state) => {
      if (state.nextRepresentative === "BILLING") return "billing_support";
      if (state.nextRepresentative === "TECHNICAL") return "technical_support";
      return END;
    },
    {
      billing_support: "billing_support",
      technical_support: "technical_support",
      [END]: END,
    }
  )
  .addEdge("billing_support", END)
  .addEdge("technical_support", END);

export const app = workflow.compile();