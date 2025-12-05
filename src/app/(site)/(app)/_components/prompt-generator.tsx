"use client";
import { z } from "zod";
import { useAppForm } from "@/components/form/shared";

const schema = z.object({
  prompt: z.string().min(1),
  images: z.array(z.string()),
});

type Value = z.infer<typeof schema>;

type Props = {
  initialPrompt?: string;
  onSubmit: (value: Value) => void;
};

export default function PromptGenerator({ initialPrompt, onSubmit }: Props) {
  const form = useAppForm({
    defaultValues: {
      prompt: initialPrompt ?? "",
      images: [] as string[],
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppField name="prompt">
        {(field) => (
          <field.TextAreaField
            label="Prompt"
            placeholder="Enter your prompt here..."
            rows={6}
          />
        )}
      </form.AppField>

      <form.AppField name="images">
        {(field) => <field.MultiImageUploadField label="Reference Images" />}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton />
      </form.AppForm>
    </form>
  );
}
