import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

/**
 * Automatically scroll form to the first errored field
 */
const ErrorFocus = () => {
  const {
    formState: { isSubmitting, isValidating, errors },
  } = useFormContext();

  useEffect(() => {
    const keys = Object.keys(errors);

    if (keys.length > 0 && isSubmitting && !isValidating) {
      const errorElement =
        document.querySelector(`label[for="${keys[0]}"]`) ??
        document.querySelector(`input[name="${keys[0]}"]`);

      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isSubmitting, isValidating, errors]);

  return null;
};

export default ErrorFocus;
