import { format } from "node:util";

import { z, util } from "zod";
import { createMiddleware, AIMessage } from "langchain";

import { classificationPromptTemplate } from "./prompts.js";

const stateSchema = z.object({
  contextHistory: z.array(z.string()).default([]),
  currentTask: z.string().optional(),
});

export const stateClassificationMiddleware = createMiddleware({
  name: "RecursiveLoopMiddleware",
  stateSchema,
  modifyModelRequest: async (request, state, runtime) => {
    const currentHistory = state.contextHistory ?? [];
    const currentTask = state.currentTask;

    /**
     * end the loop if the user is satisfied
     */
    const lastToolCall = runtime.toolCalls.at(-1);
    const isUserSatisfied =
      lastToolCall?.name === "attempt_completion" &&
      (lastToolCall?.result as string)?.includes(
        "TASK COMPLETED - User is satisfied"
      );

    if (isUserSatisfied) {
      return {
        ...request,
        tools: [], // No tools available - task is done
        systemPrompt:
          "Task has been completed successfully. No further actions needed.",
        toolChoice: "none",
      };
    }

    /**
     * get all tools
     */
    const allTools = [
      "new_task", // New Task tools
      "ask_for_clarification",
      "confirm_action", // Question tools
      "read_file",
      "list_files",
      "search_files",
      "write_to_file", // Action tools
      "attempt_completion", // Completion tools
    ];

    /**
     * get the system prompt
     */
    const systemPrompt = format(
      classificationPromptTemplate,
      currentTask || "No active task",
      currentHistory.join(" → "),
      currentTask
        ? `FOCUS: You are working on "${currentTask}". If it mentions a specific file, work with that file directly!`
        : "START: Define a new task first"
    );

    /**
     * return the modified request
     */
    return {
      ...request,
      tools: allTools,
      systemPrompt,
      toolChoice: "required", // Force tool usage
    };
  },
  afterModel: (state, runtime) => {
    /**
     * add tool results to context and loop back
     */
    const lastToolCall = runtime.toolCalls.at(-1);
    const result = (lastToolCall?.result as string) || "";
    const lastAction = state.contextHistory?.at(-1);
    if (lastToolCall?.name === "new_task") {
      if (result.includes("NEW TASK CONFIRMED:")) {
        // Extract and set current task
        const taskMatch = result.match(
          /NEW TASK CONFIRMED: (task_\d+) - "([^"]+)"/
        );
        return {
          currentTask: taskMatch?.[2],
          contextHistory: [
            ...(state.contextHistory || []),
            `Started task: ${taskMatch?.[2]}`,
          ],
        };
      }

      if (result.includes("TASK FEEDBACK:")) {
        const feedbackMatch = result.match(/TASK FEEDBACK: "([^"]+)"/);
        if (feedbackMatch) {
          return {
            contextHistory: [
              ...(state.contextHistory || []),
              `Task feedback: ${feedbackMatch?.[1]}`,
            ],
          };
        }
      }
    }

    /**
     * clear context and task
     */
    if (lastAction === "attempt_completion") {
      return {
        contextHistory: [],
        currentTask: undefined,
      };
    }

    /**
     * For all other tools, just add a simple context note
     */
    const hasError =
      result.includes("Error:") || result.includes("does not exist");
    return {
      contextHistory: [
        ...(state.contextHistory || []),
        hasError
          ? `${lastToolCall?.name}: encountered error`
          : `${lastToolCall?.name}: completed successfully`,
      ],
    };
  },
});
