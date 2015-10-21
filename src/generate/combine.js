import Generator from './generator';

const MAIN_TEMPLATE = `
<!DOCTYPE html>
<http>
  <head>
    {{#each contents as |content name|}}
    <template id="{{name}}-template">
      {{content}}
    </template>
    {{/each}}
  </head>
  <body></body>
</http>`

export default function(contents) {

};
