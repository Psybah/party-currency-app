import { toast } from "react-hot-toast";

// Helper to format backend error messages
export const formatErrorMessages = (error) => {
  if (!error) return "An unexpected error occurred";

  if (typeof error === "string") return error;

  if (error.message) return error.message;

  // Handle nested error objects from backend
  if (typeof error === "object") {
    const messages = [];
    Object.entries(error).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        messages.push(`${key}: ${value.join(", ")}`);
      } else if (typeof value === "string") {
        messages.push(`${key}: ${value}`);
      }
    });
    return messages.join("\n");
  }

  return "An unexpected error occurred";
};

// Success toast with default options
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

// Error toast with default options
export const showError = (error) => {
  toast.error(formatErrorMessages(error), {
    duration: 4000,
    position: "top-right",
  });
};

// Info toast with default options
export const showInfo = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-0">
        <div className="flex items-start">
          <div className="flex-1 ml-3">
            <p className="font-medium text-gray-900 text-sm">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-gray-200 border-l">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex justify-center items-center p-4 border border-transparent rounded-none rounded-r-lg focus:ring-2 focus:ring-bluePrimary w-full font-medium text-bluePrimary text-sm hover:text-blueSecondary focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  ));
};

// Loading toast with promise
export const showLoading = (promise, { loading, success, error }) => {
  return toast.promise(promise, {
    loading: loading || "Loading...",
    success: success || "Success!",
    error: (err) => formatErrorMessages(err),
  });
};

// Async operation wrapper with feedback
export const withFeedback = async (operation, options = {}) => {
  const {
    loadingMessage = "Processing...",
    successMessage = "Operation completed successfully!",
    transform = (data) => data,
  } = options;

  return toast.promise(
    new Promise(async (resolve, reject) => {
      try {
        const result = await operation();
        const transformedResult = transform(result);
        resolve(transformedResult);
      } catch (error) {
        reject(error);
      }
    }),
    {
      loading: loadingMessage,
      success: successMessage,
      error: (err) => formatErrorMessages(err),
    }
  );
};

// Auth-specific feedback methods
export const showAuthSuccess = (message = "Authentication successful!") => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showAuthError = (error) => {
  toast.error(formatErrorMessages(error), {
    duration: 4000,
    position: "top-right",
  });
};

// Form validation feedback
export const showValidationError = (message) => {
  toast.error(message, {
    duration: 3000,
    position: "top-right",
  });
};
