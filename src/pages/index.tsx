import getfilteredItems from "@lib/hashroot/get-streamers";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";

const Home = () => {
  const { data: session } = useSession();

  if (session) {
    const checkVerification = async () => {
      try {
        await fetch(`/api/add-record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        alert(e);
      }
    };
    return (
      <>
        <p>
          Signed in as {session?.user.id} / {session?.user.name}
        </p>

        <div>
          <button onClick={() => checkVerification()}>Connect</button>
        </div>

        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  await getfilteredItems();

  // const response = await prisma.streamers.findMany();
  // const streamerList = response.map(streamer => streamer.channelId);

  // const twitchClient: Client = new tmi.client({
  //   connection: {
  //     reconnect: true,
  //     secure: true
  //   },
  //   channels: streamerList
  // });

  // twitchClient.on("connected", () => {
  //   console.log("Connected");
  // });
  // twitchClient.on("message", (channel, tags, message, self) => {
  //   console.log(channel, message);
  // });

  // twitchClient.connect();

  return {
    props: {
      session
    }
  };
};
