import { Component, VERSION, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@regio-ki/material';
import * as d3 from 'd3';
import { Arc, DefaultArcObject } from 'd3';

@Component({
  selector: 'lib-pie-chart',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="container">
      <mat-card id="piechart-card" appearance="outlined">
        <mat-card-header>
          <h3>GPT Usage</h3>
        </mat-card-header>
        <mat-card-actions>
          <div id="piechart" class="piechart-container"></div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
#piechart-card{
  display: flex;
  flex-direction: column;
  min-height:40vh;
  overflow:hidden;
  border:none;
}

mat-card-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
h3 {
        font-family: Poppins;
        font-size: 20px;
        font-weight: 600;
        line-height: 30px;
      }

mat-card-actions {
  display: flex;
  align-items: center; 
  justify-content: center;
  flex: 1;
}

.piechart-container {
  width: 100%;
  height: 100%;
}
  `,
})
export class PieChartComponent {
  name = 'Angular ' + VERSION.major;

  ngOnInit() {
    this.bindChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.bindChart();
  }

  bindChart() {
    // Clear any existing chart
    d3.select('#piechart').selectAll('*').remove();

    const datatest = [
      { name: 'Work Hours', value: 49.15, color: '#008080' },
      { name: 'Over Time', value: 33, color: '#0080801A' },
    ];

    const container = d3.select('#piechart-card').node() as HTMLElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = 0;

    const pie1 = d3
      .pie()
      .value((d: any) => d.value)
      .sort(null);

    const arc: Arc<any, DefaultArcObject> = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    const svg: any = d3
      .select('#piechart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    svg
      .selectAll('path')
      .data(pie1(datatest as any))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => d.data.color);
  }
}
