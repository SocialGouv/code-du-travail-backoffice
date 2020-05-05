/// <reference types="React" />

declare interface TestRendering {
  children: TestRendering[] | null;
  findByType: (type: string) => TestRendering;
  innerText: string | null;
  props: { [propName: string]: any };
  type: string;
}

declare function testRender(component: React.Component): TestRendering;
