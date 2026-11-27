import type { VideoItem } from "./schema";

export function createSampleItems(now: number = Date.now()): VideoItem[] {
  return [
    {
      id: "sample-for-bigger-blazes",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      category: "Motion",
      title: "For Bigger Blazes",
      isSample: true,
      addedAt: now,
    },
    {
      id: "sample-for-bigger-escapes",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      category: "Cinema",
      title: "For Bigger Escapes",
      isSample: true,
      addedAt: now + 1,
    },
    {
      id: "sample-for-bigger-fun",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      category: "Product",
      title: "For Bigger Fun",
      isSample: true,
      addedAt: now + 2,
    },
    {
      id: "sample-for-bigger-joyrides",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      category: "Motion",
      title: "For Bigger Joyrides",
      isSample: true,
      addedAt: now + 3,
    },
    {
      id: "sample-for-bigger-meltdowns",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      category: "Product",
      title: "For Bigger Meltdowns",
      isSample: true,
      addedAt: now + 4,
    },
    {
      id: "sample-subaru-outback",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      category: "Automotive",
      title: "Subaru Outback On Street & Dirt",
      isSample: true,
      addedAt: now + 5,
    },
    {
      id: "sample-bullrun",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      category: "Automotive",
      title: "We Are Going On Bullrun",
      isSample: true,
      addedAt: now + 6,
    },
    {
      id: "sample-big-buck-bunny",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      category: "Cinema",
      title: "Big Buck Bunny",
      isSample: true,
      addedAt: now + 7,
    },
  ];
}
