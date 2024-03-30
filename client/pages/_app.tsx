import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import "@/styles/globals.css";
import useAuthCheck from "@/hooks/useAuthCheck";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";

const queryClient = new QueryClient();

type ResponseMeDto = {
  msg: string;
  user: {
    _id: number;
    username: string;
  };
};

interface CustomAppProps extends AppProps {
  username: string;
  isAuth: boolean;
  token: string;
}

export default function MyApp(props: CustomAppProps) {
  const { Component, pageProps, username, isAuth, token } = props;

  useEffect(() => {
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider values={{ isAuth, username }}>
        <QueryClientProvider client={queryClient}>
          <AppCacheProvider {...props}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <main>
              <Component {...pageProps} />
            </main>
          </AppCacheProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

MyApp.getInitialProps = async (context) => {
  const token = context.ctx.req ? context.ctx.req.cookies.token : null;
  let response;
  if (token) {
    response = await axios
      .get<ResponseMeDto>(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }
  return {
    username: response ? response.user.username : undefined,
    isAuth: response ? true : false,
    token: token,
  };
};
