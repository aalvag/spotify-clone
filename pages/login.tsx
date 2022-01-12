import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import logo from "../assets/spotify-logo.png";

interface Props {
  providers: {
    callbackUrl: string;
    name: string;
    id: string;
    type: string;
    signinUrl: string;
  };
}

function Login({ providers }: Props) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <Image
        alt="Spotify Logo"
        width={250}
        height={250}
        src={logo}
        priority={true}
        className="mb-5"
      />
      {Object.values(providers).map((provider: any) => (
        <button
          key={provider.name}
          className="bg-[#18D860] text-white p-5 rounded-full"
          onClick={() => signIn(provider.id, { callbackUrl: "/" })}
        >
          <p>Login with {provider.name}</p>
        </button>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
