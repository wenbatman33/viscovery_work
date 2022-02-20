/**
 * Created by amdis on 2017/2/6.
 */
export const toDropDownOptions = (forms, locale) => {
  if (!forms || forms.length < 1) { return []; }

  return forms.map(form => getOption(form, locale));
};

const getOption = (form, locale) => (
  {
    label: form.name(locale),
    value: form.id(),
  }
);
