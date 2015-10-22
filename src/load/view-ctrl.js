export default class {
  constructor() {}

  handleAuthResult_(authResult) {
    if (authResult && !authResult.error) {
      gapi.client.load('drive', 'v2').then(function() {
        // Step 5: Assemble the API request
        // var request = gapi.client.plus.people.get({
        //   'userId': 'me'
        // });
        // // Step 6: Execute the API request
        // request.then(function(resp) {
        //   var heading = document.createElement('h4');
        //   var image = document.createElement('img');
        //   image.src = resp.result.image.url;
        //   heading.appendChild(image);
        //   heading.appendChild(document.createTextNode(resp.result.displayName));
        //
        //   document.getElementById('content').appendChild(heading);
        // }, function(reason) {
        //   console.log('Error: ' + reason.result.error.message);
        // });
      });
    } else {
      gapi.auth.authorize(
          {
            client_id: window['CLIENT_ID'],
            scope: ['https://www.googleapis.com/auth/drive.readonly'],
            immediate: false
          },
          this.handleAuthResult_.bind(this));
    }
  }

  setup_() {
    gapi.client.setApiKey(window['API_KEY']);
    gapi.auth.authorize(
        {
          client_id: window['CLIENT_ID'],
          scope: ['https://www.googleapis.com/auth/drive.readonly'],
          immediate: true
        },
        this.handleAuthResult_.bind(this));
  }

  onLoadClick() {
    this.setup_();
  }
};
