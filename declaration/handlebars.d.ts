interface IHandlebars {
  compile: (input: any, options?: any) => HandlebarsTemplateDelegate;
  registerHelper: (name: string, fn: Function, inverse?: boolean) => void;
  registerPartial: (name: string, str: any) => void;
}
