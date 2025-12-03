import { expect, it, describe } from "vitest";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

import { ChatAnthropic } from "../../chat_models.js";
import { codeExecution_20250825 } from "../codeExecution.js";

const createModel = () =>
  new ChatAnthropic({
    model: "claude-sonnet-4-5",
    temperature: 0,
  });

describe("Anthropic Code Execution Tool Integration Tests", () => {
  it("code execution tool can be bound to ChatAnthropic and performs calculations", async () => {
    const llm = createModel();
    const llmWithCodeExecution = llm.bindTools([codeExecution_20250825()]);

    const response = await llmWithCodeExecution.invoke([
      new HumanMessage(
        "Calculate the mean of [1, 2, 3, 4, 5]. Just give me the number."
      ),
    ]);

    expect(response).toBeInstanceOf(AIMessage);
    expect(Array.isArray(response.content)).toBe(true);

    const contentBlocks = response.content as Array<{ type: string }>;

    // Should have server_tool_use for code execution
    const hasServerToolUse = contentBlocks.some(
      (block) => block.type === "server_tool_use"
    );

    // Should have code execution result
    const hasCodeExecutionResult = contentBlocks.some(
      (block) =>
        block.type === "bash_code_execution_tool_result" ||
        block.type === "text_editor_code_execution_tool_result"
    );

    expect(hasServerToolUse).toBe(true);
    expect(hasCodeExecutionResult).toBe(true);

    const [toolUse, toolResult, result] = response.content;
    expect(toolUse).toEqual(
      expect.objectContaining({
        type: "server_tool_use",
        id: expect.any(String),
        name: "bash_code_execution",
        input: {
          command:
            'python3 -c "print(sum([1, 2, 3, 4, 5]) / len([1, 2, 3, 4, 5]))"',
        },
      })
    );
    expect(toolResult).toEqual(
      expect.objectContaining({
        type: "bash_code_execution_tool_result",
        tool_use_id: expect.any(String),
        content: expect.objectContaining({
          type: "bash_code_execution_result",
          stdout: "3.0\n",
          stderr: "",
          return_code: 0,
          content: [],
        }),
      })
    );
    expect(result).toEqual(
      expect.objectContaining({
        type: "text",
        text: expect.any(String),
      })
    );
  }, 60000);
});
