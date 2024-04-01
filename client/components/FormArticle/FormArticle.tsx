import {
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "@/hooks/useArticles";
import { Article, ErrorField, initialValues } from "@/types";
import { compareObjects } from "@/utils/compareObjects";
import { Box, Button, TextField, Typography } from "@mui/material";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import OverlayLoader from "../OverlayLoader/OverlayLoader";

type Props = {
  initialValues?: Article;
};

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  link: yup
    .string()
    .required("Link is required")
    .matches(
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
      "Enter correct url"
    ),
  pubDate: yup.string(),
});

const FormArticle = ({ initialValues }: Props) => {
  const dataValues = {
    title: initialValues?.title || "",
    link: initialValues?.link || "",
    pubDate: initialValues?.pubDate || new Date().toDateString(),
  };
  const [formValues, setFormValues] = useState(dataValues);
  const router = useRouter();

  const { isLoading: createLoading, mutate: mutateCreate } = useCreateArticle();
  const { isLoading: updateLoading, mutate: mutateUpdate } = useUpdateArticle();
  const { isLoading: deleteLoading, mutate: mutateDelete } = useDeleteArticle();

  const handleDelete = async () => {
    const onSuccess = () => router.push("/");
    mutateDelete({ _id: initialValues?._id || "", onSuccess });
  };

  return (
    <Box sx={{ position: "relative" }}>
      {(createLoading || updateLoading || deleteLoading) && <OverlayLoader />}
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          if (initialValues) {
            const onSuccess = (values: initialValues) => {
              window.scrollTo(0, 0);
              setFormValues(values);
            };
            mutateUpdate({ values, _id: initialValues?._id || "", onSuccess });
          } else {
            const onSuccess = (_id: string) => {
              window.scrollTo(0, 0);
              router.push(`/edit/${_id}`);
            };
            const onError = (details: ErrorField[]) => {
              window.scrollTo(0, 0);
              setFormValues(values);
              details.forEach((detail) => {
                setFieldError(
                  detail.field === "url" ? "link" : detail.field,
                  detail.message
                );
              });
            };
            mutateCreate({ values, onSuccess, onError });
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
            {initialValues && <Typography variant="h3">Edit Form</Typography>}
            {!initialValues && (
              <Typography variant="h3">Create Form</Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              placeholder="Title"
              name="title"
              autoComplete="title"
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
              maxDate={new Date()}
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                type="button"
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
                disabled={!isValid || compareObjects(formValues, values)}
              >
                Save
              </Button>
              {initialValues && (
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: "fit-content" }}
                  onClick={handleDelete}
                  color="error"
                >
                  Delete
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default FormArticle;
