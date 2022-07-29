type core = {
  staff: number;
  dw: number;
  trainee: number;
};

type month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

type session = {
  awal: core;
  leaver?: core;
  akhir?: core;
  month: month;
};

type outlet = {
  1?: session;
  2?: session;
  3?: session;
  4?: session;
  5?: session;
  6?: session;
  7?: session;
  8?: session;
  9?: session;
  10?: session;
  11?: session;
  12?: session;
};

type year = {
  [key: string]: outlet;
};

export { year, outlet, session, core };

// CFV, CK, WL, TSB Zoo, TSB Ubud, TSB Sanur, Izzy, Lost Hotels, Besties, Catering
