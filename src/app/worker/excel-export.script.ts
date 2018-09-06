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
  importScripts(`${input.protocol}//${input.host}${input.path}scripts/xlsx.full.min.js`);

  // Allocate the existing headers
  const headers = input.config.header;
  // Process the body data
  const data = input.config.body.map(row => {
    // Transform each row into an array of KV with colId and colValue
    const cellsData = row.cells.map((cell, index) => {
      const element = {};
      element[headers[index]] = cell.data;
      return element;
    });

    // Finally, aggregate cells on a single object
    // Tried Object.assign but the generated minified output failed on browser
    const output = {};
    cellsData.forEach((cell) => {
      const cellKey = Object.keys(cell)[0];
      output[cellKey] = cell[cellKey];
    });
    return output;
  });

  const worksheet: WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const writtenBook = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});
  // Call postMessage with the result data.
  postMessage(writtenBook);
};
