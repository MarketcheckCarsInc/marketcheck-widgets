import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "mc-api-widgets";

  ngOnInit() {
    // setTimeout(() => {
    //   alert("JS working");
    // }, 1500);
  }
}
