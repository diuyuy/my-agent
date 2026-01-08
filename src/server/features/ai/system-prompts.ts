export const SYSTEM_PROMPTS = {
  GENERATE_TITLE:
    "다음 메시지를 기반으로 해당 대화의 타이틀을 10자 이내로 작성해주세요.",
  getSystemPrompt(context?: string) {
    return `If the response might become long, please reply in Markdown format. If there is any content in the Context below, please refer to that context when providing your answer. Answer in the user's message language..

    Context: ${context}
    `;
  },
} as const;
