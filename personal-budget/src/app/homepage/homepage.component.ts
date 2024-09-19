import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    })
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
}
