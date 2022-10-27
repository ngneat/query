import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>ngneat/query Demo</h2>
    <p>The TanStack Query (also known as react-query) adapter for Angular applications</p>
    <p>Using the Rick And Morty API</p>
    <p>
      (Built by <a href="https://www.twitter.com/tuantrungvo">@tuantrungvo</a>)
    </p>
    <section>
      <h5>Why ngneat/query?</h5>
      <p>
        In this demo you will be able to see how ngneat/query is a significant
        improvement over any other general-purpose state management.
      </p>
      <p>
        Simply associate a key with your fetch call and let
        <strong>ngneat/query</strong> handle the rest.
      </p>
      <h5>Ready to get started?</h5>
      <p>
        Check out the
        <a routerLink="/rick-morty/episodes"> Episodes </a>
        and
        <a routerLink="/rick-morty/characters"> Characters </a>
        !
      </p>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
