import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
  value: number = 0
  ws!: WebSocket
  tokens: number[] = []  //Stock market tickers for subscribe

  dataMap: Map<number, liveData> = new Map<number, liveData>();

  constructor() {

  }
  ngOnInit() {
    this.ws = new WebSocket(/* add your web socket connection url**/);
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      const message = {
        "a": "subscribe",
        "v": this.tokens,
        "mode": "ltp"
      };
      // Send the message to the WebSocket server
      this.ws.send(JSON.stringify(message));
    };

    this.ws.onmessage = (event) => {
      this.updateData(JSON.parse(event.data))

    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

  }

  updateData(data: liveData) {
    //this is way better than findIndex
    let test = this.dataMap.get(data.instrument_token)
    if (test) {
      Object.assign(test, data)
    } else {
      this.dataMap.set(data.instrument_token, data)
    }
  }

  ngOnDestroy(): void {
    this.ws.close();
  }

}


interface liveData {
  change: number
  instrument_token: number
  last_price: number
  mode: string
  ohlc: Ohlc
  close: number
  high: number
  low: number
  open: number
  tradable: boolean
}

interface Ohlc {
  open: number
  high: number
  low: number
  close: number
}
