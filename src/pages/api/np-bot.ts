import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, userDiscordId } = req.body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return null;
  }

  const response: any = await axios
    .post(
      `${process.env.API_ENDPOINT}/add-moderator`,
      {
        userDiscordId,
        userId,
      },
      {
        headers: {
          "x-api-key": process.env.API_KEY as string,
        },
      },
    )
    .catch((error: any) => {
      return error.response;
    });

  if (response.status === 500) {
    return res.status(500).json({ error: `${response.data.err}` });
  }

  return res.status(201).json({ error: "" });
}
