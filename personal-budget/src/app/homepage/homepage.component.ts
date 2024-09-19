import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets: [
        {
            data: [] as any,
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#4bc0c0',
                '#9966ff',
                '#ff9f40'
            ]
        }
    ],
    labels: [] as any
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: any[]) => {
      for (var i = 0; i < data.length; i++) {
        this.dataSource.datasets[0].data[i] = data[i].budget;
        this.dataSource.labels[i] = data[i].title;
      }
      this.createChart();
      this.createD3Chart(data);
    });
  }

  createChart() {
    var canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      if (ctx){
        var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.dataSource
        });
      }
    }
  }

  createD3Chart(data: any) {
    var width = 400, height = 400, radius = Math.min(width, height) / 2;

    var svg = d3.select('#donutChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var color = d3.scaleOrdinal()
      .range(this.dataSource.datasets[0].backgroundColor);

    var arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var pie = d3.pie()
      .sort(null)
      .value(function(d: any) { return d; });

    var g = svg.selectAll('.arc')
      .data(pie(data.map(function(d: any) { return d.budget; })))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', (d: any) => arc(d))
      .style('fill', function(d: any): string { return color(d.index) as string; });

    g.append('text')
      .attr('transform', function(d: any) { return 'translate(' + arc.centroid(d) + ')'; })
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(function(d: any) { return data[d.index].title; });
  }
}
