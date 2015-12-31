interface HTMLAnchorElement {
  download: string;
}

interface HTMLIFrameElement {
  srcdoc: string;
}

interface DOMParser {
  new (): DOMParser;
}

interface IQueryable {
  querySelector(selector: string): Element;
}

interface NodeSelector extends IQueryable { }
