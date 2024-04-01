import Head from "next/head";
import { AppContext, AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useEffect, useState } from "react";
import { NextRequest } from "next/server";
import authService from "@/services/auth.service";
import articlesService from "@/services/articles.service";
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import getLPTheme from "@/theme";
import "@/styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface CustomAppProps extends AppProps {
  username: string;
  isAuth: boolean;
  token: string;
}

export default function MyApp(props: CustomAppProps) {
  const { Component, pageProps, username, isAuth, token } = props;

  const [mode, setMode] = useState<PaletteMode>("dark");
  const LPtheme = createTheme(getLPTheme(mode));
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (token) {
      authService.instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      articlesService.instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loader = document.getElementById("globalLoader");
      if (loader) loader.remove();
    }
  }, []);

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
              <title>Article app</title>
            </Head>
            <main>
              <ThemeProvider theme={LPtheme}>
                <CssBaseline />
                <Component
                  {...pageProps}
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
              </ThemeProvider>
            </main>
          </AppCacheProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const request: any = context.ctx.req as NextRequest | undefined;
  const token = request ? request.cookies.token : null;
  let response;

  if (token) {
    response = await authService
      .me(token)
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
