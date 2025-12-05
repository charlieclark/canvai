import { type z } from "zod";

export type ValidatorError = {
  path: string;
  message: string;
};

export type FormValidatorAdapter = {
  validate: (values: unknown) => ValidatorError[];
};

export const zodValidator = <TSchema extends z.ZodType>(
  schema: TSchema
): FormValidatorAdapter => ({
  validate: (values: unknown) => {
    const result = schema.safeParse(values);
    if (!result.success) {
      return result.error.errors.map((error) => ({
        path: error.path.join("."),
        message: error.message,
      }));
    }
    return [];
  },
}); 