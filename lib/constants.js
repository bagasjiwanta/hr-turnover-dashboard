import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const EARLIEST_MONTH = dayjs("01/2020", "MM/YYYY");
const LATEST_MONTH = dayjs();

export {
  EARLIEST_MONTH, LATEST_MONTH
}