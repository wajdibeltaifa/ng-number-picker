import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  messages: string[]= [];
  quantity: number;
  
  onValueChange(e: any) {
    this.messages.push("Value changed.")
  }

}
