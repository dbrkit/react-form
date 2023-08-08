import {
  useFormContext,
  Controller,
  ControllerProps,
  FieldValues,
  FieldPath,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
} from "react-hook-form";
import { SchemaProps, useValidationSchema } from "../useValidationSchema";

interface RenderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends SchemaProps {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
  name: string;
}

interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps, "render"> {
  name: string;
  render: (props: RenderProps<TFieldValues, TName>) => React.ReactElement;
}

export default function BaseController({
  render,
  name,
  ...props
}: TextFieldProps) {
  const { control } = useFormContext();
  const validationProps = useValidationSchema(name);
  return (
    <Controller
      {...props}
      name={name}
      control={control}
      render={(renderProps) =>
        render({ ...renderProps, ...validationProps, name })
      }
    />
  );
}
