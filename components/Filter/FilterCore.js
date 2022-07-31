import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";

export default function FilterCore({
  possibleValues,
  selected,
  setSelected,
  width = 200,
  label,
}) {
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    if (typeof value == "string") {
      if (value != "") {
        setSelected(value.split(","));
      }
    } else {
      if (value.length != 0) {
        setSelected(value);
      }
    }
  };
  return (
    <FormControl sx={{ width: width }}>
      <InputLabel id={`select-${label}-label`}>{label}</InputLabel>
      <Select
        id={`select-${label}`}
        labelId={`select-${label}-label`}
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(", ")}
      >
        {possibleValues.map((y) => (
          <MenuItem value={y} key={y}>
            <Checkbox checked={selected.indexOf(y) > -1} />
            <ListItemText primary={y} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}