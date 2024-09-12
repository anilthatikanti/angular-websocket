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
  tokens: number[] = [1076225, 1199105, 758529, 2955009, 3660545]
  data: liveData[] = []

  constructor() {

  }
  ngOnInit() {
    this.ws = new WebSocket('wss://data.investit.ai');
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      const message = {
        a: "subscribe",
        v: this.tokens,
        mode: "quote"
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
    if (this.data.some(item => item.instrument_token === data.instrument_token)) {
      let index = this.data.findIndex(item => item.instrument_token === data.instrument_token)
     this.data[index] = data
    } else {
      this.data.push(data)
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
