let isValid = true;
const errors = {};

const validateEmail = (email = null) => {
  if (!email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
    isValid = false;
  }
};

const validateField = (field, data = null) => {
  if (!data.trim()) {
    isValid = false;
    return `${field} is required`;
  }
};

const validatePassword = (password) => {
  errors.password = validateField("Password", password);
  if (!errors.password) {
    if (password.length < 8) {
      errors.password = "Password length should be 8";
      isValid = false;
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(password)
    ) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol";
      isValid = false;
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
  validateEmail(userData?.email);
  isLogin
    ? (errors.password = validateField("Password", userData?.password))
    : validatePassword(userData?.password);

  if (!isLogin) {
    errors.firstName = validateField("Last name", userData?.firstName);
    errors.lastName = validateField("First Name", userData?.lastName);
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
  return { isValid, errors };
};
