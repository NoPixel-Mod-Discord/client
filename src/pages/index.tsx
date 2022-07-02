import type { GetServerSideProps } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

const Home = ({ twitchConnection }: PageProps) => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>
          Signed in as {session?.user.id} / {session?.user.name}
        </p>
        <p>
          {twitchConnection?.id} / {twitchConnection?.name}
        </p>
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

  return {
    props: {
      session,
      twitchConnection
    }
  };
};

interface PageProps {
  twitchConnection: Connection;
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
