export const validateForm = (userData, isLogin = false) => {
  let isValid = true;
  const errors = {};
  if (isLogin) {
    if (!userData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!userData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }
  } else {
    if (userData.firstName?.trim() === "" || userData.firstName?.length < 3) {
      errors.firstName = "First name must be at least 3 characters.";
      isValid = false;
    }

    if (!userData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    if (!userData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (userData.phoneNumber?.trim().length !== 10) {
      errors.phoneNumber = "Phone number must be 10 characters long";
      isValid = false;
    }

    if (!userData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!userData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (userData.password.length < 8) {
      errors.password = "Password length should be 8";
      isValid = false;
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(
        userData.password
      )
    ) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol";
      isValid = false;
    }

    if (!userData.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!userData.picture) {
      errors.picture = "Picture is required";
      isValid = false;
    }
  }
  return { isValid, errors };
};
