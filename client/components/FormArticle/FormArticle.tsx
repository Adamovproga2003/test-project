import { Article } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";

type Props = {
  initialValues: Article;
};

type ResponseEditArticleDto = {
  msg: string;
  article: Article;
};

type ResponseDeleteArticleDto = {
  msg: string;
};

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  link: yup
    .string()
    // .min(8, "Password should be of minimum 8 characters length")
    .required("Link is required"),
  pubDate: yup.string(),
});

const FormArticle = ({
  initialValues: { title, link, pubDate, _id },
}: Props) => {
  const dataValues = { title, link, pubDate };
  const [formValues, setFormValues] = useState(dataValues);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const data = await axios
      .delete<ResponseDeleteArticleDto>(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${_id}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
        return null;
      })
      .finally(() => setLoading(false));
    if (data) {
      router.push("/");
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              sx={{
                top: "0%",
                left: "0%",
                position: "absolute",
                bgcolor: "rgba(255, 255, 255, 0.5)",
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                }}
              >
                <CircularProgress />
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          window.scrollTo(0, 0);
          setLoading(true);
          const data = await axios
            .patch<ResponseEditArticleDto>(
              `${process.env.NEXT_PUBLIC_API_URL}/articles/${_id}`,
              {
                title: values.title,
                link: values.link,
                pubDate: values.pubDate,
              }
            )
            .then((response) => {
              return response.data;
            })
            .catch((error) => {
              return null;
            })
            .finally(() => setLoading(false));
          if (data) {
            setFormValues({
              title: data.article.title,
              link: data.article.link,
              pubDate: data.article.pubDate,
            });
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <>{console.log(dataValues)}</>
            <>{console.log(values)}</>
            <Typography variant="h3">Edit Form</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              placeholder="Title"
              name="title"
              autoComplete="title"
              autoFocus
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="link"
              placeholder="Link"
              id="link"
              autoComplete="link"
              value={values.link}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.link && Boolean(errors.link)}
              helperText={touched.link && errors.link}
            />
            <StaticDateTimePicker
              value={new Date(values.pubDate)}
              onChange={(value) => setFieldValue("pubDate", value, true)}
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "fit-content" }}
                color="primary"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "fit-content" }}
                disabled={
                  !isValid ||
                  JSON.stringify(formValues) === JSON.stringify(values)
                }
              >
                Save
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "fit-content" }}
                disabled={
                  !isValid ||
                  JSON.stringify(formValues) === JSON.stringify(values)
                }
                onClick={() => router.push("/")}
              >
                Save and Exit
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "fit-content" }}
                onClick={handleDelete}
                color="error"
              >
                Delete
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default FormArticle;
