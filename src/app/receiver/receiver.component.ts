import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss']
})
export class ReceiverComponent implements OnInit {

  @ViewChild('inputValue') inputValue:ElementRef;

  navigator: any;
  connection;
  event: Event;
  message;

  constructor(@Inject(DOCUMENT) private document: Document, 
  private changeDetector: ChangeDetectorRef) { 
    this.navigator = this.document.defaultView.navigator;
  }

  ngOnInit(): void {
  }

  @HostListener('window:DOMContentLoaded', ['$event'])
  receiveInit() {
    if (this.navigator.presentation.receiver) {
      this.navigator.presentation.receiver.connectionList.then((connectionList:any) => {
        connectionList.connections.map((connection: any) => {
          this.connection = connection;
          this.connection.onmessage = (event: MessageEvent) => this.handlerOnmessage(event);
         });
      });
    }
  }

  handlerOnmessage(event: MessageEvent) {
      this.message = event.data;
      this.changeDetector.detectChanges();
  }

  sendMessage() {
    if (this.connection) {
      this.connection.send(this.inputValue.nativeElement.value);
    }
  }

}
