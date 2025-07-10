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
    return value.length > 0 || 'Passwrod is required';
  };

  export const validateConfirmPassword =  (value, password) => { 
    if (value != password)  return 'Confirm Password and New Password mismatch';
    if(value.length == 0) return 'Confirm Password is Required';
    return true
  };

  export const amountFieldRule =  (value) => {  
    if(value < 0) return 'Amount must not not be less than zero';
    return true
  }; 
  
  

  export const validateCode =  (value) => {
    return value.length > 0 || 'Validation Code is required';
  };
  
  export const validatePhoneNumber =  (value) => {
    return value.length > 0 || 'Phone Number is required';
  }; 
  
    export const validateInputField =  (value ="") => {
    return (typeof value !== 'undefined' && value.length > 0) || 'This Filed is required';
  }; 

  export const inputFieldRequired =  (value) => {
   if(value == "" || String(value).trim() == "") return 'This Field  is required'; 
  return true
  };

export const numberInputFieldRequired =  (value) => { 
   if(value == "" || String(value).trim() == "") return 'this Field  is required';
   if(value < 0) return 'Field must not be less than zero';
    return true
  };

  export const isRequired =  (value) => {
    return value || 'This field is required';
  }; 
  
  
   