import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: string
}

const VerificationEmail = ({ username, otp} : EmailTemplateProps) => {
  return (
  <div>
    <h1>Welcome, {username}!</h1>
    <h1> {otp}!</h1>
  </div>
)
};

export default VerificationEmail;
