import { getGenerationDimensions, DEFAULT_RESOLUTION } from "./image";
import type { AspectRatio } from "./image";

/**
 * Creates a minimal tldraw store snapshot with a single frame.
 * This is used for onboarding new users with a ready-to-use canvas.
 */
export function createDefaultSnapshot(
  aspectRatio: AspectRatio = "1:1",
  frameName = "1:1 - 2K",
) {
  const dimensions = getGenerationDimensions(aspectRatio, DEFAULT_RESOLUTION);
  const frameId = `shape:onboarding-frame`;

  // Center the frame on the canvas
  const x = -dimensions.width / 2;
  const y = -dimensions.height / 2;

  return {
    store: {
      // Document record (required)
      "document:document": {
        gridSize: 10,
        name: "",
        meta: {},
        id: "document:document",
        typeName: "document",
      },
      // Page record (required)
      "page:page": {
        meta: {},
        id: "page:page",
        name: "Page 1",
        index: "a1",
        typeName: "page",
      },
      // The frame shape
      [frameId]: {
        x,
        y,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: frameId,
        type: "frame",
        props: {
          w: dimensions.width,
          h: dimensions.height,
          name: frameName,
        },
        parentId: "page:page",
        index: "a1",
        typeName: "shape",
      },
    },
    schema: {
      schemaVersion: 2,
      sequences: {
        "com.tldraw.store": 4,
        "com.tldraw.asset": 1,
        "com.tldraw.camera": 1,
        "com.tldraw.document": 2,
        "com.tldraw.instance": 25,
        "com.tldraw.instance_page_state": 5,
        "com.tldraw.page": 1,
        "com.tldraw.instance_presence": 5,
        "com.tldraw.pointer": 1,
        "com.tldraw.shape": 4,
        "com.tldraw.asset.bookmark": 2,
        "com.tldraw.asset.image": 5,
        "com.tldraw.asset.video": 5,
        "com.tldraw.shape.arrow": 5,
        "com.tldraw.shape.bookmark": 2,
        "com.tldraw.shape.draw": 2,
        "com.tldraw.shape.embed": 4,
        "com.tldraw.shape.frame": 0,
        "com.tldraw.shape.geo": 9,
        "com.tldraw.shape.group": 0,
        "com.tldraw.shape.highlight": 1,
        "com.tldraw.shape.image": 4,
        "com.tldraw.shape.line": 5,
        "com.tldraw.shape.note": 8,
        "com.tldraw.shape.text": 2,
        "com.tldraw.shape.video": 2,
        "com.tldraw.binding.arrow": 0,
      },
    },
  };
}
