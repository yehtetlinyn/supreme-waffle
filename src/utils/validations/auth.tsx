import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  identifier: Yup.string().required("Identifier is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8+ characters required"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Enter email and try again !")
    .email("Invalid email address"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/,
      "Password needs to be strong"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "The passwords you entered do not match"),
});
