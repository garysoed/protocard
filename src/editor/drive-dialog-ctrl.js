import ImageResource from '../data/image-resource';

/**
 * @class editor.DriveDialogCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   * @param {common.GapiService} GapiService
   */
  constructor($scope, GapiService) {
    this.$scope_ = $scope;
    this.gapiService_ = GapiService;
    this.clientPromise_ = GapiService.getClientPromise('drive', 'v2');
    this.resourceUrl_ = '';
    this.resources_ = [];
  }

  /**
   * Updates the resources with the given resource URL.
   * @method updateResources_
   * @param {string} resourceUrl URL to update the resources with.
   * @return {Promise} Promise that will be resolved after the resources has been updated.
   */
  updateResources_(resourceUrl) {
    // TODO(gs): Actually allow any URLs
    // TODO(gs): Loading
    return this.gapiService_
        .authenticate(['drive.readonly'])
        .then(() => {
          return this.clientPromise_;
        })
        .then(client => {
          return Promise.all([
            client,
            client.children.list({ folderId: resourceUrl })
          ]);
        })
        .then(values => {
          let [client, response] = values;
          let batch = this.gapiService_.newBatch();

          response.result.items.map(child => {
            batch.add(client.files.get({ fileId: child.id }));
          });

          return Promise.all([
            client.files.get({ fileId: resourceUrl }),
            batch
          ]);
        })
        .then(values => {
          let [folderResponse, batchResponse] = values;
          let webViewLink = folderResponse.result.webViewLink;

          this.resources_ = [];
          // TODO(gs): Convert to use Promise.all.
          for (let responseKey in batchResponse.result) {
            let response = batchResponse.result[responseKey];
            let file = response.result;
            this.resources_.push(new ImageResource(
                file.title,
                `${webViewLink}${file.title}`,
                file.thumbnailLink));
          }
          this.$scope_.$apply(() => {});
        });
  }

  /**
   * Resources that have been loaded.
   *
   * @property resources
   * @type {Array}
   * @readonly
   */
  get resources() {
    return this.resources_;
  }

  /**
   * URL to load the resources.
   *
   * @property resourceURL
   * @type string
   */
  get resourceURL() {
    return this.resourceUrl_;
  }
  set resourceURL(resourceUrl) {
    this.resourceUrl_ = resourceUrl;
    this.updateResources_(resourceUrl);
  }
}
