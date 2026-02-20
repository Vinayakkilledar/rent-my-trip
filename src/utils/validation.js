// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 1 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 1;
};

// Phone validation (not empty)
export const isValidPhone = (phone) => {
  return phone && phone.trim().length > 0;
};

// License number validation (basic)
export const isValidLicense = (license) => {
  return license && license.trim().length > 0;
};

// Validate registration form
export const validateRegistrationForm = (formData, userType) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isValidPassword(formData.password)) {
    errors.password = 'Password is required';
  }

  if (!isValidPhone(formData.phone)) {
    errors.phone = 'Phone number is required';
  }

  if (userType === 'driver') {
    if (!isValidLicense(formData.licenseNumber)) {
      errors.licenseNumber = 'License number is required';
    }

    if (!formData.carType) {
      errors.carType = 'Please select a car type';
    }
  }

  return errors;
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};
