const errors = {};

const validateEmail = (email) => {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Email is invalid";
  }
};

const validateField = (field, data = null) => {
  if (data && data?.trim() === "") {
    return `${field} is required`;
  }
};

const validatePassword = (password) => {
  errors.password = validateField("Password", password);
  if (!errors.password) {
    if (password && password?.length < 8) {
      errors.password = "Password length should be 8";
    }
    if (password && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol";
    }
  }
};

const validateConfirmPassword = (password, confirmPassword) => {
  return password !== confirmPassword && "Password do not match";
};

const validatePhoneNumber = (phoneNumber, length) => {
  return (
    phoneNumber?.trim().length !== length &&
    "Phone number must be 10 characters long"
  );
};

export const validateForm = (userData, isLogin = false) => {
  let isValid = true;
  errors.email = validateField("Email", userData?.email);
  if (!errors.email) {
    errors.email = validateEmail(userData?.email);
  }
  isLogin
    ? (errors.password = validateField("Password", userData?.password))
    : validatePassword(userData?.password);

  if (!isLogin) {
    errors.firstName = validateField("First name", userData?.firstName);
    errors.lastName = validateField("Last Name", userData?.lastName);
    errors.picture = validateField("Picture", userData?.picture);
    errors.confirmPassword = validateField(
      "Confim Password",
      userData?.confirmPassword
    );
    if (!errors.confirmPassword) {
      errors.confirmPassword = validateConfirmPassword(
        userData?.password,
        userData?.confirmPassword
      );
    }
    errors.phoneNumber = validateField("Phone Number", userData?.phoneNumber);
    if (!errors.phoneNumber) {
      errors.phoneNumber = validatePhoneNumber(userData?.phoneNumber, 10);
    }
  }

  for (const key in errors) {
    if (errors[key]) {
      isValid = false;
      break;
    }
  }
  return { isValid, errors };
};
