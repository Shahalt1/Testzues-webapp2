// Form field for text input
export const TextAreaField = ({
  label,
  id,
  name,
  placeholder,
  rows,
  cols,
  className,
}) => (
  <>
    <label htmlFor={id}>{label}</label>
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      className={className}
    />
  </>
);

// Form field for file upload
export const FileUploadField = ({ label, id, name, className }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input type="file" id={id} name={name} className={className} />
  </>
);

export const ApiKey = ({ label, id, name, className, placeholder }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input
      type="password"
      id={id}
      name={name}
      className={className}
      placeholder={placeholder}
    />
  </>
);
// Dropdown selection field
export const SelectField = ({ label, id, name, options, className }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} className={className}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </>
);

// Checkbox group
export const CheckboxGroup = ({ legend, options, className }) => (
  <fieldset className={className}>
    <legend>{legend}</legend>
    {options.map((option) => (
      <label key={option.value}>
        <input type="checkbox" name={option.name} value={option.value} />
        {option.label}
      </label>
    ))}
  </fieldset>
);

// Radio group
export const RadioGroup = ({ legend, name, options, className }) => (
  <fieldset className={className}>
    <legend>{legend}</legend>
    {options.map((option) => (
      <label key={option.value}>
        <input
          type="radio"
          name={name}
          value={option.value}
          defaultChecked={option.defaultChecked}
        />
        {option.label}
      </label>
    ))}
  </fieldset>
);
