import { useMemo, PropsWithChildren } from "react";
import { useWatch, UseWatchProps } from "react-hook-form";

interface Props {
  name: any;
  condition: (value: any) => boolean;
}

export default function Conditional({
  name,
  control,
  condition,
  children,
  ...props
}: PropsWithChildren<Omit<UseWatchProps<any>, "name">> & Props) {
  const watch = useWatch<{ s: any }>({ name, control, ...props });
  const valid = useMemo(() => condition(watch), [watch, condition]);
  return valid ? <>{children}</> : null;
}
