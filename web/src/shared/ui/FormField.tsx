import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useCallback, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function FormField({
  id,
  label,
  required = false,
  type = "text",
  ...props
}: FormFieldProps) {
  const { register } = useFormContext();
  const { errors } = useFormState();

  return (
    <div className="flex flex-col mb-3 text-sm">
      <Label htmlFor={id} text={label} />
      <Input
        id={id}
        type={type}
        {...props}
        {...register(id, { required: required })}
        className="mb-2"
      />
      {errors[id] && (
        <div>
          <p className="text-red-500 text-xs">{errors[id].message as string}</p>
        </div>
      )}
    </div>
  );
}

FormField.displayName = "FormField";

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  defaultValues?: DefaultValues<T>;
  schema: ZodTypeAny;
}

export function Form<T extends FieldValues>({
  onSubmit,
  children,
  schema,
  defaultValues,
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema as any),
  });

  const handleSubmit = useCallback<SubmitHandler<T>>(
    (data) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>{children}</form>
    </FormProvider>
  );
}

Form.displayName = "Form";
