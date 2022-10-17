export function getFormData<T = any>(form: any): T {
  const data = {};

  Object.keys(form).forEach((key) => {
    Object.assign(data, { [key]: (<HTMLInputElement>form[key]).value })
  });

  return data as T;
}