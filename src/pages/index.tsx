import { Avatar, Button } from "flowbite-react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";

const Home = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen relative dark:bg-gray-900">
        <div className="flex flex-col space-y-6">
          <Avatar
            img={session.user.image}
            rounded={true}
            bordered={true}
            size="lg"
          >
            <div className="space-y-1 font-medium dark:text-white">
              <p>{session?.user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session?.user.id}
              </p>
            </div>
          </Avatar>
        </div>
        <div className="absolute top-6 right-8">
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen dark:bg-gray-900">
      <Button onClick={() => signIn("discord")}>Sign in Discord</Button>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
};
