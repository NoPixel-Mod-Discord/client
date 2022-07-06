import prisma from "@lib/prisma";
import { parse } from "node-html-parser";

const getStreamerList = async (): Promise<void> => {
  const response = await fetch("https://nopixel.hasroot.com/streamers.php")
    .then(res => res.text())
    .catch(err => {
      console.error(err);
    });

  const data = parse(response || "");
  const list = data.querySelectorAll(".streamerInfo");

  list.map(async (tag: any) => {
    const info = tag._attrs;

    const streamerData: StreamerData = {
      userId: info["data-id"],
      lastOnline: new Date(info["data-lastonline"]),
      channelId: info["data-streamername"],
      streamType: "twitch"
    };

    const response = await prisma.streamers.createMany({
      data: {
        userId: streamerData.userId,
        lastOnline: streamerData.lastOnline,
        channelId: streamerData.channelId,
        streamType: "twitch"
      },
      skipDuplicates: true
    });

    return response;
  });
};

export default getStreamerList;

type StreamerData = {
  userId: string;
  lastOnline: Date;
  channelId: string;
  streamType: string;
};
