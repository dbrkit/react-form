import { createContext, FC } from "react";
import { ValidationSchema } from "./useValidationSchema";

export type BaseContextProps = React.PropsWithChildren;

export type ValidationSchemaContextProps = ValidationSchema & BaseContextProps;

export const ValidationSchemaContext = createContext<ValidationSchema>({
  schema: undefined,
});

const ValidationSchemaProvider: FC<ValidationSchemaContextProps> = ({
  schema,
  children,
}) => {
  return (
    <ValidationSchemaContext.Provider value={{ schema }}>
      {children}
    </ValidationSchemaContext.Provider>
  );
};

export default ValidationSchemaProvider;
