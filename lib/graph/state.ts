import { Annotation } from "@langchain/langgraph/web";
import { BaseMessage } from "@langchain/core/messages";

export const IdeaGenerationAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>(),
  shouldEnd: Annotation<boolean>(),
  nextRepresentative: Annotation<string>(),
});

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>(),
  shouldEnd: Annotation<boolean>(),
  nextRepresentative: Annotation<string>(),
  ideaGeneration: Annotation<typeof IdeaGenerationAnnotation.State>(),
});

export type State = typeof StateAnnotation.State;
