import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password })
  }
`;

export const REQUEST_PASSWORD_OTP = gql`
  mutation forgotpassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const VERIFY_PASSWORD_OTP = gql`
  mutation verifyOtp($identifier: String!, $otpCode: String!) {
    verifyOtp(input: { identifier: $identifier, otpCode: $otpCode })
  }
`;

export const RESEND_PASSWORD_OTP = gql`
  mutation resendOtp($identifier: String!) {
    resendOtp(input: { identifier: $identifier })
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword(
    $optCode: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      code: $optCode
      password: $password
      passwordConfirmation: $confirmPassword
    )
  }
`;
