import { useState } from "react";
import { showSuccess, showError, showLoading } from "@/utils/feedback";
import { formatErrorMessage } from "@/utils/errorUtils";

/**
 * Custom hook to handle API requests with feedback
 *
 * @returns {Object} The hook's state and methods
 */
export const useFeedbackHandler = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle API requests with appropriate loading and feedback states
   *
   * @param {Function} apiCall - The API call function to execute
   * @param {Object} options - Options for the API call
   * @returns {Promise<any>} The result of the API call
   */
  const handleRequest = async (apiCall, options = {}) => {
    const {
      loadingMessage = "Loading...",
      successMessage,
      onSuccess,
      onError,
      showLoadingToast = true,
      showSuccessToast = true,
    } = options;

    setIsLoading(true);

    try {
      let result;

      if (showLoadingToast) {
        // Use toast.promise for loading state
        result = await showLoading(apiCall(), {
          loading: loadingMessage,
          success: successMessage,
          error: (err) => formatErrorMessage(err),
        });
      } else {
        // Execute without toast
        result = await apiCall();
        if (successMessage && showSuccessToast) {
          showSuccess(successMessage);
        }
      }

      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      // Format the error and show toast only if not using showLoading
      if (!showLoadingToast) {
        showError(error);
      }

      // Call the onError callback if provided
      if (onError && typeof onError === "function") {
        onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequest,
  };
};
