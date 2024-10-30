import { app } from './graph';

export const runWorkflow = async (userInput: string) => {
  const result = await app.invoke({
    messages: [{ role: "user", content: userInput }],
    shouldEnd: false,
    nextRepresentative: "",
  });

  const aiMessage = result.messages[result.messages.length - 1];
  return {
    response: aiMessage.content,
    shouldEnd: result.shouldEnd,
  };
};