import prisma from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const accessToken = session?.accessToken || "";

  const response = await fetch(
    "https://discord.com/api/users/@me/connections",
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    }
  );

  const connections = await response.json();
  const twitchConnection = await connections.find(
    (connection: Connection) => connection.type === "twitch"
  );

  if (session) {
    const result = await prisma.mods.createMany({
      data: {
        discordId: session?.user.id || "",
        twitchId: twitchConnection.id,
        streamerId: twitchConnection.id,
        createdAt: new Date(),
        isVerified: true,
        modType: "twitch"
      },
      skipDuplicates: true
    });

    res.json(result);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}

type Connection = {
  type: string;
  id: string;
  name: string;
  visibility: number;
  fried_sync: boolean;
  show_activity: boolean;
  verified: boolean;
};
