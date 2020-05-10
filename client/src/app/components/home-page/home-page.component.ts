import { Component, OnInit } from '@angular/core';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  faCoins = faCoins;
  faListAlt = faListAlt;
  faChartBar = faChartBar;
  faCloudDownloadAlt = faCloudDownloadAlt;

  constructor() { }

  ngOnInit(): void {
  }

}
