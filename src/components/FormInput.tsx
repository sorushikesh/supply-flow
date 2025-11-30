import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";
import { forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  showValidation?: boolean;
  containerClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      showValidation = true,
      containerClassName,
      required,
      className,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={props.id}
            className="text-sm font-medium flex items-center gap-1"
          >
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "transition-all duration-200",
              hasError &&
                "border-destructive focus-visible:ring-destructive pr-10",
              hasSuccess &&
                showValidation &&
                "border-green-500 focus-visible:ring-green-500 pr-10",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
          {showValidation && (
            <>
              {hasError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AlertCircle
                    className="h-4 w-4 text-destructive"
                    aria-hidden="true"
                  />
                </div>
              )}
              {hasSuccess && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check
                    className="h-4 w-4 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </>
          )}
        </div>
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-xs text-destructive flex items-center gap-1 animate-slide-up-fade"
            role="alert"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${props.id}-helper`}
            className="text-xs text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
