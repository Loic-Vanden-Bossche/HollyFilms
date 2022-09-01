import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ProcessingService } from '../../shared/services/processing.service';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
import {
  faHardDrive,
  faMemory,
  faMicrochip,
  faServer,
  faTemperatureHalf,
} from '@fortawesome/free-solid-svg-icons';
import { DiskMetrics } from '../../shared/models/system-metrics.model';
import * as dayjs from 'dayjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-server-metrics',
  templateUrl: './server-metrics.component.html',
  animations: [
    trigger('onMetric', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px) translateX(-20px) Rotate(5deg)',
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 1,
            transform: 'translateY(0px) translateX(0px) Rotate(0deg)',
          })
        ),
      ]),
    ]),
    trigger('OnChart', [
      transition(':enter', [
        style({
          opacity: 0,
          height: '0rem',
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 1,
            height: '9rem',
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          height: '9rem',
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 0,
            height: '0rem',
          })
        ),
      ]),
    ]),
  ],
})
export class ServerMetricsComponent implements OnInit, OnChanges {
  @Input() displayChart = false;

  chart?: BaseChartDirective;

  @ViewChild(BaseChartDirective) set chartElem(
    chart: BaseChartDirective | undefined
  ) {
    if (chart) {
      this.chart = chart;
    }
  }

  cpuUsage: number | null = null;
  memoryUsage: number | null = null;
  temperatureUsage: number | null = null;
  disks: DiskMetrics[] = [];
  upTime: string | null = null;

  hardDriveIcon = faHardDrive;
  temperatureIcon = faTemperatureHalf;
  memoryIcon = faMemory;
  cpuIcon = faMicrochip;
  serverIcon = faServer;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'TEMP',
        backgroundColor: 'rgba(148,159,177,0.2)',
        pointRadius: 0,
        borderColor: (context: { chart: any }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          return this.getGradient(ctx, chartArea);
        },
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'CPU',
        backgroundColor: 'rgba(251, 189, 35,0.1)',
        borderColor: 'rgba(251, 189, 35,1)',
        pointRadius: 2,
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'RAM',
        yAxisID: 'y-axis-1',
        pointRadius: 0,
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {
        type: 'timeseries',
        time: {
          minUnit: 'second',
        },
        ticks: {
          display: false, //this will remove only the label
        },
        adapters: {
          date: {
            locale: fr,
          },
        },
      },
      'y-axis-0': {
        ticks: {
          display: false, //this will remove only the label
        },
      },
      'y-axis-1': {
        suggestedMax: 100,
        suggestedMin: 0,
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
          display: false,
        },
      },
    },

    plugins: {
      legend: { display: true, position: 'left' },
    },
  };

  constructor(private readonly processingService: ProcessingService) {}

  trackUndefined() {
    return undefined;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['displayChart'] && this.displayChart) {
      this.resetChartData();
      this.chart?.update();
    }
  }

  shiftChartData() {
    this.lineChartData.datasets.forEach((dataset) => dataset.data.shift());
    this.lineChartData.labels?.shift();
  }

  resetChartData() {
    this.lineChartData.datasets.forEach((dataset) => (dataset.data = []));
    this.lineChartData.labels = [];
  }

  ngOnInit(): void {
    this.processingService
      .onSystemInfosUpdated()
      .pipe(takeWhile(() => this.displayChart))
      .subscribe(({ cpu, disks, mem, uptime }) => {
        this.cpuUsage = cpu.usage;
        this.memoryUsage = (mem.used / mem.total) * 100;
        this.temperatureUsage = (cpu.temp / cpu.maxTemp) * 100;
        this.disks = disks;
        this.upTime = dayjs.duration(uptime, 'seconds').format('DD:HH:mm:ss');

        if (this.lineChartData.datasets[0].data.length > 10 * 60) {
          this.shiftChartData();
        }

        this.lineChartData.datasets[0].data.push(cpu.temp);
        this.lineChartData.datasets[1].data.push(cpu.usage);
        this.lineChartData.datasets[2].data.push(mem.used);
        if (this.lineChartOptions?.scales) {
          (this.lineChartOptions.scales as any)['y-axis-1'].suggestedMax =
            mem.total;
        }

        this.lineChartData?.labels?.push(new Date());

        this.chart?.update();
      });
  }

  getGradient(
    ctx: {
      createLinearGradient: (
        arg0: number,
        arg1: any,
        arg2: number,
        arg3: any
      ) => any;
    },
    chartArea: { right: number; left: number; bottom: number; top: number }
  ) {
    let width, height, gradient;

    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (gradient === null || width !== chartWidth || height !== chartHeight) {
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      gradient.addColorStop(0, 'blue');
      gradient.addColorStop(0.5, 'red');
      gradient.addColorStop(1, 'green');
    }

    return gradient;
  }
}
