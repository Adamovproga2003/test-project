import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useLogin } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";
import { AxiosError } from "axios";
import Copyright from "@/components/Copyright/Copyright";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    // .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export default function Admin() {
  const router = useRouter();

  const { isLoading, mutate, isError, error } = useLogin();
  const { onChangeAuth, onChangeUsername } = useAuth();

  const errorMessage =
    isError && error instanceof AxiosError
      ? error?.response?.data.error
      : "An unknown error occurred";

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const onSuccess = (username: string) => {
        router.push("/");
        onChangeAuth(true);
        onChangeUsername(username);
      };
      mutate({ ...values, onSuccess });
    },
  });

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              placeholder="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            {isError && (
              <Alert variant="filled" severity="error">
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress /> : "Sign In"}
            </Button>
          </form>
        </Box>
        <Copyright sx={{ mt: 2, mb: 2 }} />
      </Container>
    </>
  );
}
