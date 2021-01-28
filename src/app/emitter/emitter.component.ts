import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare const PresentationRequest: any;

@Component({
  selector: 'app-emitter',
  templateUrl: './emitter.component.html',
  styleUrls: ['./emitter.component.scss']
})
export class EmitterComponent implements OnInit {
  
  @ViewChild('inputValue') inputValue:ElementRef;

  readonly receiveUrl = 'http://localhost:4200/receiver';
  presentationRequest;
  connection;
  navigator: any;
  buttonDisabled = true;
  message;

  constructor(@Inject(DOCUMENT) private document: Document, 
  private changeDetector: ChangeDetectorRef) {
    this.navigator = this.document.defaultView.navigator;
    try {
      this.presentationRequest =  new PresentationRequest(this.receiveUrl);
      this.navigator.defaultRequest = this.presentationRequest;
    } catch {
      console.log("API not suported");
    }
   }

  ngOnInit(): void {
    if (this.navigator.defaultRequest) {
      this.navigator.defaultRequest.getAvailability().then((availability: any) => {
        console.log(availability);
        if(availability){
          this.buttonDisabled = availability.value
        }
      }).catch(error => {
        console.log('> ' + error.name + ': ' + error.message);
        this.buttonDisabled = true;
      });
    }
  }

  start() {
    if (this.navigator.defaultRequest) {
      this.navigator.defaultRequest.start().then((connection: any) => {
        this.connection = connection;
        this.connection.onmessage = (event) => this.handlerOnmessage(event);
      }).catch(error=> {
        console.log('> ' + error.name + ': ' + error.message);
      });
    }

  }

  close() {
    if (this.connection) {
      this.connection.close();
    }
  }

  terminate() {
    if (this.connection) {
      this.connection.terminate();
    }
  }

  reconnect() {
    if (!!this.connection.id) {
      this.navigator.defaultRequest.reconnect(this.connection.id).then((connection: any) => {
        this.connection = connection;
      }).catch(error => {
        console.log('> ' + error.name + ': ' + error.message);
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
