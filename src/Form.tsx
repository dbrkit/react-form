import { yupResolver } from "@hookform/resolvers/yup";
import { FormHTMLAttributes } from "react";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import * as Yup from "yup";
import { isFunction } from "@dbrkit/js-utils";

import ValidationSchemaProvider from "./ValidationSchemaProvider";
import ErrorFocus from "./components/ErrorFocus";
import catchErrors from "./catchErrors";

export type FormContainerProps<T extends FieldValues> = UseFormProps<T> & {
  children:
    | React.ReactNode
    | ((
        props: UseFormReturn<T, object> & { submitHandler: any }
      ) => React.ReactNode);
  onSubmit: (data: T, props?: any) => unknown | Promise<unknown>;
  initialValues?: UseFormProps<T>["defaultValues"];
  validationSchema?: Yup.AnyObjectSchema;
};

export default function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  initialValues,
  validationSchema,
  ...useFormProps
}: FormContainerProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    ...useFormProps,
    resolver:
      validationSchema && yupResolver(validationSchema, {}, { raw: true }),
    defaultValues: initialValues,
  });

  const submitHandler = (values: any) => {
    return catchErrors(onSubmit(values, form), ({ key, error }) =>
      form.setError(key as any, {
        type: "manual",
        message: error,
      })
    );
  };

  return (
    <FormProvider {...form}>
      <ValidationSchemaProvider schema={validationSchema}>
        {isFunction(children) ? children({ submitHandler, ...form }) : children}
      </ValidationSchemaProvider>
    </FormProvider>
  );
}
