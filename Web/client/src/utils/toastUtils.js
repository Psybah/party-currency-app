import { toast } from "react-hot-toast";
import { formatErrorMessages } from "./feedback";

// Form submission feedback
export const handleFormSubmissionFeedback = (promise, options = {}) => {
  const {
    loading = "Submitting form...",
    success = "Form submitted successfully!",
    error = "Failed to submit form",
  } = options;

  return toast.promise(promise, {
    loading,
    success,
    error: (err) => formatErrorMessages(err) || error,
  });
};

// API request feedback
export const handleApiRequestFeedback = (promise, options = {}) => {
  const {
    loading = "Loading data...",
    success = "Data loaded successfully!",
    error = "Failed to load data",
  } = options;

  return toast.promise(promise, {
    loading,
    success,
    success: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      return success;
    },
    error: (err) => {
      if (options.onError) {
        options.onError(err);
      }
      return formatErrorMessages(err) || error;
    },
  });
};

// Authentication feedback
export const handleAuthFeedback = (promise, options = {}) => {
  const {
    loading = "Authenticating...",
    success = "Authentication successful!",
    error = "Authentication failed",
  } = options;

  return toast.promise(promise, {
    loading,
    success,
    error: (err) => formatErrorMessages(err) || error,
  });
};

// Confirmation feedback (for delete/update operations)
export const confirmationFeedback = (message, action) => {
  toast(
    (t) => (
      <div className="bg-white p-4 rounded shadow-lg flex flex-col items-start gap-4">
        <p className="text-gray-700">{message}</p>
        <div className="flex gap-2 self-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              action();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    { duration: 10000 }
  );
};
