import { expect, it, describe } from "vitest";
import { tools } from "../index.js";

describe("OpenAI Image Generation Tool Tests", () => {
  it("imageGeneration creates a basic valid tool definition", () => {
    expect(tools.imageGeneration()).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": undefined,
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with size option", () => {
    expect(
      tools.imageGeneration({
        size: "1024x1024",
      })
    ).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": undefined,
        "size": "1024x1024",
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with quality option", () => {
    expect(
      tools.imageGeneration({
        quality: "high",
      })
    ).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": "high",
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with output format and compression", () => {
    expect(
      tools.imageGeneration({
        outputFormat: "jpeg",
        outputCompression: 90,
      })
    ).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": 90,
        "output_format": "jpeg",
        "partial_images": undefined,
        "quality": undefined,
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with transparent background", () => {
    expect(
      tools.imageGeneration({
        background: "transparent",
      })
    ).toMatchInlineSnapshot(`
      {
        "background": "transparent",
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": undefined,
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with partial images for streaming", () => {
    expect(
      tools.imageGeneration({
        partialImages: 2,
      })
    ).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": 2,
        "quality": undefined,
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with input image mask", () => {
    expect(
      tools.imageGeneration({
        inputImageMask: {
          fileId: "file-abc123",
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": {
          "file_id": "file-abc123",
          "image_url": undefined,
        },
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": undefined,
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with all options", () => {
    expect(
      tools.imageGeneration({
        background: "opaque",
        inputFidelity: "high",
        inputImageMask: {
          imageUrl: "data:image/png;base64,abc123",
          fileId: "file-xyz789",
        },
        model: "gpt-image-1",
        moderation: "auto",
        outputCompression: 85,
        outputFormat: "webp",
        partialImages: 3,
        quality: "medium",
        size: "1536x1024",
      })
    ).toMatchInlineSnapshot(`
      {
        "background": "opaque",
        "input_fidelity": "high",
        "input_image_mask": {
          "file_id": "file-xyz789",
          "image_url": "data:image/png;base64,abc123",
        },
        "model": "gpt-image-1",
        "moderation": "auto",
        "output_compression": 85,
        "output_format": "webp",
        "partial_images": 3,
        "quality": "medium",
        "size": "1536x1024",
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with auto options", () => {
    expect(
      tools.imageGeneration({
        background: "auto",
        quality: "auto",
        size: "auto",
      })
    ).toMatchInlineSnapshot(`
      {
        "background": "auto",
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": undefined,
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": "auto",
        "size": "auto",
        "type": "image_generation",
      }
    `);
  });

  it("imageGeneration creates tool with gpt-image-1-mini model", () => {
    expect(
      tools.imageGeneration({
        model: "gpt-image-1-mini",
        quality: "low",
      })
    ).toMatchInlineSnapshot(`
      {
        "background": undefined,
        "input_fidelity": undefined,
        "input_image_mask": undefined,
        "model": "gpt-image-1-mini",
        "moderation": undefined,
        "output_compression": undefined,
        "output_format": undefined,
        "partial_images": undefined,
        "quality": "low",
        "size": undefined,
        "type": "image_generation",
      }
    `);
  });
});

