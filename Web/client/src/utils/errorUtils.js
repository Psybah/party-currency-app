export const formatErrorMessage = (error) => {
  try {
    // Handle string errors
    if (typeof error === "string") return error;

    // Handle null or undefined
    if (!error) return "An error occurred";

    // Handle error object
    let errorObj = error;

    // If the error is a response with data, extract the data
    if (error.response && error.response.data) {
      errorObj = error.response.data;
    }

    // Check if we have a JSON string and parse it
    if (typeof errorObj === "string") {
      try {
        errorObj = JSON.parse(errorObj);
      } catch (e) {
        // Not a JSON string, return as is
        return errorObj;
      }
    }

    if (typeof errorObj === "object") {
      if (
        errorObj.detail &&
        typeof errorObj.detail === "string" &&
        errorObj.detail.includes("email")
      ) {
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
  const fieldErrors = [
    "email",
    "phone_number",
    "password",
    "first_name",
    "last_name",
    "detail",
  ];
  return fieldErrors.some((field) => errors[field]);
};
