// Data
type core = {
  staff: number;
  dw: number;
  trainee: number;
};

type session = {
  awal?: core;
  leaver?: core;
  akhir?: core;
  voluntary?: core;
};

type year = {
  [key in month]?: session;
};

type outlet = {
  [key: string]: year;
};

type company = {
  [key: string]: outlet;
};

// Filter
type outletNames = string[];

type month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type filterYear = number;

type filterDataType =
  | "Jumlah Karyawan"
  | "Leaver"
  | "Voluntary Leaver"
  | "Involuntary Leaver"
  | "Turnover Rate";

type Filter = {
  outletNames: outletNames;
  startMonth: month;
  startYear: filterYear;
  endMonth: month;
  endYear: filterYear;
  dataType: filterDataType;
};

// chart utils
type outputTemplate = {
  month: string;
  [key: string]: number;
  m: month;
  y: filterYear;
};

type GenerateOutputTemplate = (
  startMonth: month,
  startYear: filterYear,
  endMonth: month,
  endYear: filterYear,
  outletNames: outletNames
) => {
  mainOutput: outputTemplate[];
  staffOutput: outputTemplate[];
  dwOutput: outputTemplate[];
  traineeOutput: outputTemplate[];
};

export {
  year,
  outlet,
  session,
  core,
  company,
  outletNames,
  Filter,
  month,
  GenerateOutputTemplate,
};

// CFV, CK, WL, TSB Zoo, TSB Ubud, TSB Sanur, Izzy, Lost Hotels, Besties, Catering
