export const validateUsername = (value) => {
    const minLength = 3;
    if (!value) return 'Username is required';
    if (value.length < minLength) return `Username must be at least ${minLength} characters long`;
    if (value === 'admin') return 'Username is not available';
    return true; // Valid
  };
  
  export const validateEmail = (value) => {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailPattern.test(value) || 'Invalid email format';
  };

 
  export const validatePassword =  (value) => {
    return value.length > 0 || "Passwrod is required";
  };

  export const validateConfirmPassword =  (value, password) => {
    console.log(">>>>>>password >>>>>>>",password)
    if (value != password)  return "Confirm Password and New Password mismatch";
    if(value.length == 0) return "Confirm Password is Required";
    return true
  };

  export const amountFieldRule =  (value, password) => {
    console.log(">>>>>>password >>>>>>>",password)
    if (value.length <= 0)  return "This field is required";
    if(value < 0) return "Amount must not not be less than zero";
    return true
  }; 
  
  

  export const validateCode =  (value) => {
    return value.length > 0 || "Validation Code is required";
  };
  
  export const validatePhoneNumber =  (value) => {
    return value.length > 0 || "Phone Number is required";
  }; 
  
  export const inputFieldRequired =  (value) => {
    return value.length > 0 || "This field is required";
  };


  export const isRequired =  (value) => {
    return value || "This field is required";
  }; 
  
  
   