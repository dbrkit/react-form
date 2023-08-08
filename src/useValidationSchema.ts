import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  FieldValue,
  FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { AnySchema, reach, SchemaDescription } from "yup";

import { ValidationSchemaContext } from "./ValidationSchemaProvider";

export interface SchemaProps {
  required?: boolean;
  min?: number | Date;
  max?: number | Date;
  length?: number;
}

export interface ValidationSchema {
  schema?: AnySchema;
}

export type ValidationSchemaContextProps = ValidationSchema;

export type ResolveOptions<TField = FieldValue<any>, TForm = FieldValues> = {
  value?: TField;
  parent?: TForm;
};

export interface ValidationSchemaProps {
  required?: boolean;
  min?: number;
  max?: number;
  minDate?: Date;
  maxDate?: Date;
  length?: number;
}

const initialValue = {
  required: false,
  min: undefined,
  max: undefined,
  minDate: undefined,
  maxDate: undefined,
  length: undefined,
};

/**
 * An hook that extract relevant field validation information from the Yup schema associated to
 * the form.
 *
 * @param {String} name The name of the field
 */
/**
 * Extracts relevant field validation information from the Yup schema associated to the form.
 *
 * @param {String} name The name of the field.
 * @returns {Object} Relevant props from the schema.
 */
export function useValidationSchema(name: string) {
  const { schema } = useContext(ValidationSchemaContext);
  const { getValues } = useFormContext();
  const mounted = useRef(false);

  const reachedSchema = useMemo(() => {
    if (!schema) return undefined;

    try {
      const fieldSchema: ReturnType<typeof reach> & {
        deps?: readonly string[];
      } = reach(schema, name);
      return fieldSchema;
    } catch (e) {
      console.log("useValidationSchemaHook error", e);
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  const watchFields = useWatch({
    name: reachedSchema?.deps?.length ? reachedSchema.deps : [],
  });

  const [props, setProps] = useState<ValidationSchemaProps>(initialValue);

  const _injectSchema = useCallback(
    () => {
      if (!mounted.current) return;

      let describeValues: ResolveOptions | undefined;

      if (reachedSchema?.deps) {
        const parent = getValues();
        describeValues = { value: {}, parent };
        const deps = getValues(reachedSchema.deps);

        reachedSchema.deps.forEach((dep, index) => {
          if (describeValues) describeValues.value[dep] = deps[index];
        });
      }

      const fieldValues = reachedSchema?.describe(
        describeValues
      ) as SchemaDescription;

      const { tests, type, optional } = fieldValues;

      let min =
        tests?.find((test) => test.name === "min")?.params?.min ??
        tests?.find((test) => test.name === "min")?.params?.more;

      let max =
        tests?.find((test) => test.name === "max")?.params?.max ??
        tests?.find((test) => test.name === "max")?.params?.more;

      const length = +(tests?.find((test) => test.name === "length")?.params
        ?.length as number);

      const minDate: undefined | Date =
        type === "date" ? (min as Date) : undefined;
      const maxDate: undefined | Date =
        type === "date" ? (max as Date) : undefined;

      min = minDate ? undefined : +(min as number);
      max = maxDate ? undefined : +(max as number);

      setProps({
        required: !optional,
        min: Number.isNaN(min) ? undefined : (min as number),
        max: Number.isNaN(max) ? undefined : (max as number),
        minDate,
        maxDate,
        length: Number.isNaN(length) ? undefined : length,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reachedSchema]
  );

  useEffect(() => {
    mounted.current = true;
    if (!reachedSchema) return;

    _injectSchema();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, reachedSchema, ...watchFields]);

  // Return relevant props from schema
  return { ...props };
}
