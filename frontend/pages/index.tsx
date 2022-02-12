import type { GetServerSideProps, NextPage } from "next";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetcher from "../utils/fetcher";
import getGoogleOAuthURL from "../utils/getGoogleURL";

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}
const Home: NextPage<{fallbackData: User}> = ({ fallbackData }) => {
  const { data } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );

  if (data) {
    return <div>Welcome you are logged in {data.name}</div>;
  }
  return <div className={styles.container}>Please Login
  <a href={getGoogleOAuthURL()}>Google Log in</a>
  </div>;
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
  context.req.headers //in order to pass through middleware
  );
  return { props: { fallbackData: data } };
}

export default Home;
