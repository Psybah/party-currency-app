export const formatErrorMessage = (error) => {
  if (!error) return "";
  
  try {
    // If error is already a string, return it
    if (typeof error === "string") return error;
    
    // If error is an object (API response)
    if (typeof error === "object") {
      // Parse the error if it's a string representation of JSON
      const errorObj = typeof error === "string" ? JSON.parse(error) : error;
      
      // Collect all error messages
      let messages = [];
      
      Object.entries(errorObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Join multiple error messages for the same field
          messages.push(value.join(". "));
        } else if (typeof value === "string") {
          messages.push(value);
        }
      });
      
      // Join all messages with line breaks
      return messages.join("\n");
    }
    
    return "An error occurred";
  } catch (e) {
    console.error("Error parsing error message:", e);
    return "An unexpected error occurred";
  }
};