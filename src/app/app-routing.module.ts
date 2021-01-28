import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmitterComponent } from './emitter/emitter.component';
import { ReceiverComponent } from './receiver/receiver.component';


const routes: Routes = [
  {path: '', component: EmitterComponent},
  {path: 'receiver', component: ReceiverComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
