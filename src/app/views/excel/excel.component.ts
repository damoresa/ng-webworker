import { Component } from '@angular/core';

import * as fileSaver from 'file-saver';

import { WebworkerService } from './../../worker/webworker.service';
import { EXCEL_EXPORT } from './excel-export.script';
import { DriverModel } from './model/driver.model';

@Component({
  selector: 'excel-component',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent {
  public dataSource: DriverModel[] = [
    { driver: 'Michael Schumacher', seasons: '1991–2006, 2010–2012', entries: 308, wins: 91, percentage: '29.55%' },
    { driver: 'Lewis Hamilton', seasons: '2007–2018', entries: 222, wins: 68, percentage: '30.63%' },
    { driver: 'Sebastian Vettel', seasons: '2007–2018', entries: 213, wins: 52, percentage: '24.41%' },
    { driver: 'Alain Prost', seasons: '1980–1991, 1993', entries: 202, wins: 51, percentage: '25.25%' },
    { driver: 'Fernando Alonso', seasons: '2001, 2003–2018', entries: 307, wins: 32, percentage: '10.42%' },
    { driver: 'Nigel Mansell', seasons: '1980–1992, 1994–1995', entries: 191, wins: 31, percentage: '16.23%' },
    { driver: 'Jackie Stewart', seasons: '1965–1973', entries: 100, wins: 27, percentage: '27.00%' },
    { driver: 'Jim Clark', seasons: '1960–1968', entries: 73, wins: 25, percentage: '34.25%' },
    { driver: 'Niki Lauda', seasons: '1971–1979, 1982–1985', entries: 177, wins: 25, percentage: '14.12%' },
  ];
  public displayedColumns: string[] = ['driver', 'seasons', 'entries', 'wins', 'percentage'];

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  constructor(private workerService: WebworkerService) {
  }

  public exportExcel() {
    const input = {
      config: {
        body: this.dataSource
      },
      host: window.location.host,
      path: window.location.pathname,
      protocol: window.location.protocol
    };

    this.workerService.run(EXCEL_EXPORT, input).then(
      (result) => {
        this.save(result, 'export', this.EXCEL_TYPE, this.EXCEL_EXTENSION);
      }
    ).catch(console.error);
  }

  private save(file, filename, filetype, fileextension) {
    const blob = new Blob([this.s2ab(file)], {
      type: filetype
    });
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    const name = `${filename}${date}${time}.${fileextension}`;

    fileSaver.saveAs(blob, name);
  }

  private s2ab(text: string): ArrayBuffer {
    const buf = new ArrayBuffer(text.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != text.length; ++i) {
      view[i] = text.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
}
