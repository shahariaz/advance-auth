const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length > 5 },
    { label: "At least 1 uppercase letter", met: /(?=.*[A-Z])/.test(password) },
    { label: "At least 1 lowercase letter", met: /(?=.*[a-z])/.test(password) },
    { label: "At least 1 number", met: /(?=.*[0-9])/.test(password) },
    {
      label: "At least 1 special character",
      met: /(?=.*[!@#$%^&*])/.test(password),
    },
  ];
};
const PasswordStrengthMeter = () => {
  return <div></div>;
};

export default PasswordStrengthMeter;
