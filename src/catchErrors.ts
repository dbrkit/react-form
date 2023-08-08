export default function catchErrors<T>(
  fn: Promise<T> | void | T,
  onError: ({ key, error }: { key: string; error: string }) => void
) {
  return Promise.resolve(fn).catch(
    ({ errors = {} }: { errors: { [key: string]: string[] } }) => {
      if (errors) {
        for (const key in errors) {
          errors[key].forEach((error: string) => {
            onError({ key, error });
          });
        }
      }
    }
  );
}
