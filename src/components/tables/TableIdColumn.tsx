import { TableCell } from "../ui/table";

type TableIdCellProps = {
  id?: string | number | null;
};

const headerClass =
  "px-5 py-3 text-start text-sm font-medium text-black dark:text-white whitespace-nowrap";
const cellClass =
  "px-5 py-4 text-sm font-medium tabular-nums text-gray-800 dark:text-white whitespace-nowrap";

/** UI-only S.No. prefixes per admin table. Never used as record IDs. */
export const TABLE_SERIAL_PREFIX = {
  admin: "ADM",
  member: "MEM",
  officeBearer: "OBR",
  banner: "BAN",
  service: "SRV",
  donation: "DON",
  city: "CTY",
  certificate: "CRT",
  event: "EVT",
  blog: "BLG",
  photo: "PHT",
  video: "VID",
  activity: "ACT",
  achievement: "ACH",
} as const;

export type TableSerialPrefix =
  (typeof TABLE_SERIAL_PREFIX)[keyof typeof TABLE_SERIAL_PREFIX];

/**
 * Frontend-only serial number for table display.
 * Format: `${prefix}${pageOffset + rowIndex + 1}` e.g. ADM1, ADM11.
 * Never use the returned value for API/routing operations.
 */
export function getTableSerialNumber(
  currentPage: number,
  pageSize: number,
  rowIndex: number,
  prefix: string
): string {
  const page = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const size = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 0;
  const index = Number.isFinite(rowIndex) && rowIndex >= 0 ? rowIndex : 0;
  const serial = (page - 1) * size + index + 1;
  return `${prefix}${serial}`;
}

export function TableSerialHeader() {
  return (
    <TableCell isHeader className={headerClass}>
      S.No.
    </TableCell>
  );
}

export function TableSerialCell({ value }: { value: string }) {
  return <TableCell className={cellClass}>{value}</TableCell>;
}

export function TableSerialSkeletonCell() {
  return (
    <TableCell className="px-5 py-4">
      <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>
  );
}

export function TableIdHeader() {
  return (
    <TableCell isHeader className={headerClass}>
      ID
    </TableCell>
  );
}

export function TableIdCell({ id }: TableIdCellProps) {
  const value = id == null || id === "" ? "—" : String(id);
  return (
    <TableCell
      className={`${cellClass} select-all`}
      title={value === "—" ? undefined : value}
    >
      {value}
    </TableCell>
  );
}

export function TableIdSkeletonCell() {
  return (
    <TableCell className="px-5 py-4">
      <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>
  );
}
