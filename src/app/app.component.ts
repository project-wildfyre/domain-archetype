import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {catchError, map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  title = 'questionnaire-viewer';

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private http: HttpClient) {
  }

  questionnaire: string | undefined;

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
        const questionnairePath = params['q'];
        if (questionnairePath !== null) {
          this.downloadQuestionnaire(questionnairePath)
        }
      }
    )
  }

  public downloadQuestionnaire(url: string) {
    fetch(url).then(data => {
      if (data.type == 'cors') {
        data.json().then(data2 => {
          console.log(data2)
        })
      }
    })
  }
}
