import type { VideoItem } from "./schema";

export const SAMPLE_COUNT = 4;

export function createSampleItems(now: number = Date.now()): VideoItem[] {
  return [
    {
      id: "sample-lib-5s",
      url: "https://samplelib.com/mp4/sample-5s.mp4",
      category: "Motion",
      title: "Sample 5s Clip",
      isSample: true,
      addedAt: now,
    },
    {
      id: "sample-lib-30s",
      url: "https://samplelib.com/mp4/sample-30s-360p.mp4",
      category: "Cinema",
      title: "Sample 30s 360p",
      isSample: true,
      addedAt: now + 1,
    },

    {
      id: "sample-mdn-flower",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      category: "Nature",
      title: "Blooming Flower (MDN CC0)",
      isSample: true,
      addedAt: now + 2,
    },
  ];
}
