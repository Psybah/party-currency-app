
export const formatErrorMessage = (error) => {
  if (!error) return "";
  
  try {
    // If error is already a string, return it
    if (typeof error === "string") return error;
    
    // If error is an object (API response)
    if (typeof error === "object") {
      // Parse the error if it's a string representation of JSON
      const errorObj = typeof error === "string" ? JSON.parse(error) : error;
      
      // Check if there are specific email errors in a non-field_errors format
      if (errorObj.email && !errorObj.field_errors) {
        // Make sure we handle both array and string error formats
        errorObj.email = Array.isArray(errorObj.email) ? errorObj.email[0] : errorObj.email;
      }
      
      // Handle the case where error is in a different format (e.g., "A user with that email already exists.")
      if (errorObj.detail && typeof errorObj.detail === "string" && errorObj.detail.includes("email")) {
        if (!errorObj.email) {
          errorObj.email = errorObj.detail;
        }
      }
      
      // Return object as is to allow component-level error handling
      return errorObj;
    }
    
    return "An error occurred";
  } catch (e) {
    console.error("Error parsing error message:", e);
    return "An unexpected error occurred";
  }
};

// Helper function to check if we have field-specific errors
export const hasFieldErrors = (errors) => {
  if (!errors) return false;
  
  // Check if the error object has any specific field keys
  const fieldErrors = ['email', 'phone_number', 'password', 'first_name', 'last_name', 'detail'];
  return fieldErrors.some(field => errors[field]);
};
