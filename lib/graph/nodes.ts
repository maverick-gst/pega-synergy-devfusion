import { State } from './state';
import { groqLLama3_2_3b } from './model';
import { SYSTEM_TEMPLATE, CATEGORIZATION_SYSTEM_TEMPLATE, CATEGORIZATION_HUMAN_TEMPLATE } from './utils';
import { AIMessage, BaseMessage } from "@langchain/core/messages";

function extractStringContent(content: BaseMessage['content']): string {
  if (typeof content === 'string') {
    return content;
  } else if (Array.isArray(content)) {
    return content
      .map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object' && item !== null && 'text' in item) {
          return item.text;
        }
        return '';
      })
      .join(' ');
  }
  return '';
}

export const initialSupport = async (state: State) => {
  const supportResponse = await groqLLama3_2_3b.invoke([
    { role: "system", content: SYSTEM_TEMPLATE },
    ...state.messages,
  ]);

  const categorizationResponse = await groqLLama3_2_3b.invoke([
    { role: "system", content: CATEGORIZATION_SYSTEM_TEMPLATE },
    ...state.messages,
    { role: "user", content: CATEGORIZATION_HUMAN_TEMPLATE },
  ]);

  let nextRepresentative = "RESPOND";
  try {
    let contentString = '';
    if (categorizationResponse instanceof AIMessage) {
      contentString = extractStringContent(categorizationResponse.content);
    }

    const cleanedContent = contentString.replace(/```json\s*|\s*```/g, '').trim();
    const categorizationOutput = JSON.parse(cleanedContent);
    nextRepresentative = categorizationOutput.nextRepresentative || "RESPOND";
  } catch (error) {
    console.error("Error parsing categorization response:", error);
    console.log("Raw categorization response:", categorizationResponse);
  }

  return { 
    messages: [supportResponse],
    nextRepresentative,
    shouldEnd: false,
  };
};

export const billingSupport = async (state: State) => {
  // Implement billing support logic here
  // ...
};

export const technicalSupport = async (state: State) => {
  // Implement technical support logic here
  // ...
};