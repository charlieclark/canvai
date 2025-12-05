import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import type { ImageUploadProps } from "@/components/ui/image-upload";
import { Slider } from "@/components/ui/slider";
import ImagesUploader from "../ui/images-uploader";

// Create form contexts
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

type ErrorsArray = Array<{ message?: string; path?: string[] }> | undefined;

// Helper to extract error message from validation errors
export function getFieldError(errors: ErrorsArray, fieldName: string) {
  if (!errors?.length) return undefined;
  const fieldError = errors.find((error) => error.path?.[0] === fieldName);
  return fieldError?.message;
}

export type BaseFieldProps = {
  label?: string;
  placeholder?: string;
};
export type TextFieldProps = BaseFieldProps & {
  leftAddon?: React.ReactNode;
};

interface FormErrorMessageProps {
  message: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <p
      ref={ref}
      className="text-destructive text-sm"
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
}

function TextField({ label, placeholder, leftAddon }: TextFieldProps) {
  const field = useFieldContext<string>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex rounded-md">
        {leftAddon && (
          <span className="border-input bg-muted text-muted-foreground inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm">
            {leftAddon}
          </span>
        )}
        <Input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          aria-invalid={!!errorMessage}
          className={cn(leftAddon && "rounded-l-none")}
        />
      </div>
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

interface TextAreaFieldProps extends TextFieldProps {
  rows?: number;
}

function TextAreaField({ label, placeholder, rows = 4 }: TextAreaFieldProps) {
  const field = useFieldContext<string>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!errorMessage}
      />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>;
}

function SelectField({ label, placeholder, options }: SelectFieldProps) {
  const field = useFieldContext<string>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={field.state.value}
        onValueChange={field.handleChange}
        onOpenChange={() => field.handleBlur()}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

interface ImageUploadFieldProps
  extends Omit<ImageUploadProps, "value" | "onChange" | "onRemove"> {
  label?: string;
  prefix?: string;
  imageUrl?: string | null;
}

function ImageUploadField({
  label,
  prefix,
  className,
  imageUrl: initialImageUrl,
  variant = "rectangular",
  size = "md",
}: ImageUploadFieldProps) {
  const field = useFieldContext<string | null>();
  const [imageUrl, setImageUrl] = useState(
    initialImageUrl || field.state.value,
  );
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  const handleChange = useCallback(
    (url: string) => {
      setImageUrl(url);
      field.handleChange(url);
    },
    [field],
  );

  const handleRemove = useCallback(() => {
    setImageUrl("");
    field.handleChange("");
  }, [field]);

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      <ImageUpload
        value={imageUrl}
        onChange={handleChange}
        onRemove={handleRemove}
        className={className}
        variant={variant}
        size={size}
        label={prefix}
      />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

function MultiImageUploadField({ label }: ImageUploadFieldProps) {
  const field = useFieldContext<string[]>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  const handleChange = useCallback(
    (images: string[]) => {
      field.handleChange(images);
    },
    [field],
  );

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      <ImagesUploader
        images={field.state.value}
        onImagesChanged={handleChange}
      />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

interface ColorFieldProps extends TextFieldProps {
  showPreview?: boolean;
}

function ColorField({ label, placeholder }: ColorFieldProps) {
  const field = useFieldContext<string>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="border-input bg-background flex items-center gap-4 rounded-md border p-3">
        <div className="relative flex items-center">
          <div
            className="ring-input h-8 w-8 rounded-md shadow-sm ring-1"
            style={{ backgroundColor: field.state.value }}
            aria-hidden="true"
          />
          <Input
            type="color"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            aria-label={`Choose ${label || "color"}`}
            className="absolute inset-0 w-8 cursor-pointer opacity-0"
          />
        </div>
        <Input
          type="text"
          value={field.state.value.toUpperCase()}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          aria-label={`${label || "color"} hex value`}
          className="flex-1 border-0 bg-transparent px-2 font-mono uppercase focus-visible:ring-0 focus-visible:ring-offset-0"
          maxLength={7}
        />
      </div>
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

export interface SelectGridFieldProps extends TextFieldProps {
  options: {
    value: string;
    label: React.ReactNode;
    description: string;
    icon?: string;
  }[];
}

export function SelectGridField({ label, options }: SelectGridFieldProps) {
  const field = useFieldContext<string>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => field.handleChange(option.value)}
            className={cn(
              "flex flex-col items-center rounded-lg border p-4 text-center transition-all",
              "hover:border-primary/50",
              field.state.value === option.value
                ? "border-primary bg-primary/5"
                : "border-input bg-background",
            )}
          >
            {option.icon && (
              <span className="mb-3 text-3xl" role="img" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span
              className={cn("mb-1.5 font-medium", !option.icon && "text-xl")}
            >
              {option.label}
            </span>
            <span className="text-muted-foreground text-sm">
              {option.description}
            </span>
          </button>
        ))}
      </div>
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

export type ImageSelectGridOption = {
  value: string;
  label: string;
  description: string;
  imagePath: string;
};

type ImageSelectGridProps = {
  options: ImageSelectGridOption[];
} & BaseFieldProps;

export function ImageSelectGrid({ label, options }: ImageSelectGridProps) {
  const field = useFieldContext<string>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => field.handleChange(option.value)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
              field.state.value === option.value
                ? "border-primary ring-primary ring-2 ring-offset-2"
                : "border-input hover:border-primary/50",
            )}
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={option.imagePath}
                alt={`${option.label} style example`}
                className="h-full w-full object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity",
                  "group-hover:opacity-100",
                  field.state.value === option.value && "opacity-100",
                )}
              />
            </div>
            <div
              className={cn(
                "absolute right-0 bottom-0 left-0 p-3 text-white opacity-0 transition-opacity",
                "group-hover:opacity-100",
                field.state.value === option.value && "opacity-100",
              )}
            >
              <p className="font-medium">{option.label}</p>
              <p className="text-sm text-white/80">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

interface SliderFieldProps extends TextFieldProps {
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  formatValue?: (value: number) => string;
}

function SliderField({
  label,
  min = 0,
  max = 1,
  step,
  minStepsBetweenThumbs,
  formatValue = (value) => value.toFixed(1),
}: SliderFieldProps) {
  const field = useFieldContext<number>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && <Label>{label}</Label>}
        <span className="text-muted-foreground w-12 px-2 text-right text-sm">
          {formatValue(field.state.value)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        value={[field.state.value]}
        onValueChange={([value]) => field.handleChange(value!)}
        className="w-full"
      />
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

interface CheckboxFieldProps extends BaseFieldProps {
  description?: string;
}

function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const errorMessage = getFieldError(field.state.meta?.errors, field.name);

  return (
    <div className="space-y-2">
      <div 
        className="flex cursor-pointer items-start rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100"
        onClick={() => field.handleChange(!field.state.value)}
      >
        <div className="flex h-6 items-center">
          <input
            type="checkbox"
            checked={field.state.value}
            onChange={(e) => field.handleChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#0F1217] focus:ring-[#0F1217]"
          />
        </div>
        <div className="ml-3">
          <label className="text-sm text-[#111827] cursor-pointer">
            {label}
            {description && <span className="block text-gray-500">{description}</span>}
          </label>
        </div>
      </div>
      {errorMessage ? <FormErrorMessage message={errorMessage} /> : null}
    </div>
  );
}

type SubmitButtonProps = {
  children?: ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "type | disabled | children">;

function SubmitButton({
  children = "Continue",
  ...buttonProps
}: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} {...buttonProps}>
          {isSubmitting ? "Saving..." : children}
        </Button>
      )}
    </form.Subscribe>
  );
}

// Create the form hook with bound components
export const { useAppForm } = createFormHook({
  fieldComponents: {
    // Base
    TextField,
    TextAreaField,
    SelectField,
    ImageUploadField,
    MultiImageUploadField,
    ColorField,
    SelectGridField,
    ImageSelectGrid,
    SliderField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
