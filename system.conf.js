System.config({
  packages: {
    node_modules: {
      format: 'register',
      defaultExtension: 'js'
    },
    src: {
      main: 'app.js',
      format: 'register',
      defaultExtension: 'js'
    }
  }
});
System.import('src')
    .then(null, console.error.bind(console));
