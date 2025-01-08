import { Component, OnInit, VERSION, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@regio-ki/material';
import * as d3 from 'd3';

interface DataPoint {
  year: number;
  earnings: number;
}

@Component({
  selector: 'lib-line-chart',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="container">
      <mat-card id="linechart-card" appearance="outlined">
        <mat-card-header class="linechart-header">
          <h3>Companies</h3>
          <!-- <button mat-raised-button>
            Yearly
          </button> -->
        </mat-card-header>
        <mat-card-actions>
          <div id="line-chart" class="linechart-container"></div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: ` 
#linechart-card {
      display: flex;
      flex-direction: column;
      border: none;
      min-height: 40vh;
      overflow: hidden;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    mat-card-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    h3 {
        font-family: Poppins;
        font-size: 20px;
        font-weight: 600;
        line-height: 30px;
      }

    .linechart-container {
      width: 100%;
      height: 100%;
    }
  `,
})
export class LineChartComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  ngOnInit() {
    this.createLineChart();
  }

  @HostListener('window:resize')
  onResize() {
    this.createLineChart(); // Redraw the chart on window resize
  }

  createLineChart() {
    const data: DataPoint[] = [
      { year: 2016, earnings: 6000 },
      { year: 2017, earnings: 9500 },
      { year: 2018, earnings: 23000 },
      { year: 2019, earnings: 51000 },
      { year: 2020, earnings: 7000 },
      { year: 2021, earnings: 11000 },
      { year: 2022, earnings: 35000 },
      { year: 2023, earnings: 90000 },
    ];

    d3.select('#line-chart').selectAll('svg').remove();

    const container = d3.select('#linechart-card').node() as HTMLElement;
    const margin = { top: 20, right: 40, bottom: 30, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([2016, 2023]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 100000]).range([height, 0]);

    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.year))
      .y((d) => y(d.earnings))
      .curve(d3.curveLinear);

    const area = d3
      .area<DataPoint>()
      .x((d) => x(d.year))
      .y0(height)
      .y1((d) => y(d.earnings))
      .curve(d3.curveLinear);

    d3.select('#line-chart').selectAll('svg').remove();

    const svg = d3
      .select('#line-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Reusable function to append gridlines
    function appendGridlines(
      svg: any,
      axis: any,
      transform: any,
      ticks: any,
      size: any,
      strokeStyle: any
    ) {
      svg
        .append('g')
        .attr('class', 'grid')
        .attr('transform', transform)
        .call(
          axis
            .ticks(ticks)
            .tickSize(size)
            .tickFormat(() => '')
        )
        .selectAll('.tick line')
        .style('stroke', strokeStyle.color)
        .style('stroke-opacity', strokeStyle.opacity);
    }

    // X-axis gridlines (top and bottom)
    appendGridlines(
      svg,
      d3.axisBottom(x),
      `translate(0,${height})`,
      8,
      -height,
      { color: '#ddd', opacity: 0.5 }
    );
    appendGridlines(svg, d3.axisTop(x), `translate(0, 0)`, 8, -height, {
      color: '#ddd',
      opacity: 0.5,
    });

    // Y-axis gridlines (left and right)
    appendGridlines(svg, d3.axisLeft(y), `translate(0, 0)`, 5, -width, {
      color: '#ddd',
      opacity: 0.5,
    });
    appendGridlines(svg, d3.axisRight(y), `translate(${width}, 0)`, 5, -width, {
      color: '#ddd',
      opacity: 0.5,
    });

    // Style the borders (axis lines) to match the grid lines
    svg
      .selectAll('.domain')
      .style('stroke', '#ddd')
      .style('stroke-opacity', 0.5);

    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(0, 128, 128, 0.4)')
      .attr('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '99.59%')
      .attr('stop-color', 'rgba(0, 128, 128, 0)')
      .attr('stop-opacity', 1);

    svg
      .append('path')
      .data([data])
      .attr('d', area as any)
      .attr('fill', 'url(#area-gradient)')
      .attr('opacity', 1);

    svg
      .append('path')
      .data([data])
      .attr('d', line as any)
      .attr('fill', 'none')
      .attr('stroke', '#008080')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 2');

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format('d')));

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${Number(d) / 1000}k`)
      );
  }
}
