import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

export default function FilterCore({
  possibleValues,
  selected,
  setSelected,
  width,
  label,
  multiple = true,
}) {
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    if (typeof value == "string") {
      if (value != "") {
        if (multiple) {
          setSelected(value.split(","));
        } else {
          setSelected(value);
        }
      }
    } else {
      if (value.length != 0) {
        setSelected(value);
      }
    }
  };

  return (
    <FormControl sx={width ? { width: width } : undefined}>
      <InputLabel id={`select-${label}-label`}>{label}</InputLabel>
      <Select
        id={`select-${label}`}
        labelId={`select-${label}-label`}
        multiple={multiple}
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (multiple ? selected.join(", ") : selected)}
      >
        {possibleValues.map((y) => (
          <MenuItem value={y} key={y}>
            {multiple ? <Checkbox checked={selected.indexOf(y) > -1} /> : null}
            <ListItemText primary={y} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
