import { WorkSheet, WorkBook } from 'xlsx';

// These functions are defined here:
// https://github.com/Microsoft/TypeScript/blob/master/lib/lib.webworker.d.ts
// However, they're not automatically included over lib.d.ts, so we have to
// declare them manually.
declare function importScripts(...urls: string[]): void;
declare function postMessage(message: any): void;

// Declare the library object so the script can be compiled without any problem
declare const XLSX: any;

export const EXCEL_EXPORT = (input) => {
  // Allocate required libraries
  // Since the host may change, we'll request it from the caller
  importScripts(`${input.protocol}//${input.host}/scripts/xlsx.full.min.js`);

  // Process the body data
  const data = input.config.body;

  const worksheet: WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const writtenBook = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});
  // Call postMessage with the result data.
  postMessage(writtenBook);
};
