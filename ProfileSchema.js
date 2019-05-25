import * as yup from "yup";

const initialValues = {
  firstName: "",
  lastName: "",
  description: "",
  dob: "",
  phoneNumber: "",
  password: "",
  address: "",
  influencer: false
};

const minChar10 = "Minimum 10 digits";
const maxChar11 = "Exceeds maximum amount of 10 characters";
// const phoneNotValid = "Phone number is not valid";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("This field is required."),
  lastName: yup.string().required("This field is required."),
  phoneNumber: yup
    .string()
    .min(11, minChar10)
    .max(11, maxChar11)
});

export { initialValues, validationSchema };
