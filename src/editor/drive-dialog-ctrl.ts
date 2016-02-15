import GapiService from '../common/gapi-service';
import ImageResource from '../model/image-resource';

export default class DriveDialogCtrl {
  private $mdDialog_: angular.material.IDialogService;
  private $scope_: angular.IScope;
  private gapiService_: GapiService;
  private clientPromise_: Promise<gapi.drive.Client>;
  private resourceUrl_: string;
  private resources_: ImageResource[];
  private selectedImages_: ImageResource[];

  constructor(
      $mdDialog: angular.material.IDialogService,
      $scope: angular.IScope,
      GapiService: GapiService) {
    this.$mdDialog_ = $mdDialog;
    this.$scope_ = $scope;
    this.gapiService_ = GapiService;
    this.clientPromise_ = GapiService.getClientPromise<gapi.drive.Client>('drive', 'v2');
    this.resourceUrl_ = '';
    this.resources_ = [];
    this.selectedImages_ = [];
  }

  /**
   * Updates the resources with the given resource URL.
   * @param resourceUrl URL to update the resources with.
   * @return Promise that will be resolved after the resources has been updated.
   */
  private updateResources_(resourceUrl: string): Promise<void> {
    // TODO(gs): Actually allow any URLs
    // TODO(gs): Loading
    return this.gapiService_
        .authenticate(['drive.readonly'])
        .then(() => {
          return this.clientPromise_;
        })
        .then((client: any) => {
          return Promise.all([
            client,
            client.children.list({ folderId: resourceUrl, q: 'not trashed' }),
          ]);
        })
        .then((values: any[]) => {
          let [client, response] = values;
          let batch = this.gapiService_.newBatch();

          response.result.items.map((child: any) => {
            batch.add(client.files.get({ fileId: child.id }));
          });

          return Promise.all([
            client.files.get({ fileId: resourceUrl }),
            batch,
          ]);
        })
        .then((values: any[]) => {
          let [folderResponse, batchResponse] = values;
          let webViewLink = folderResponse.result.webViewLink;

          this.resources_ = [];
          for (let responseKey in batchResponse.result) {
            let response = batchResponse.result[responseKey];
            let file = response.result;
            this.resources_.push(new ImageResource(
                file.title,
                `${webViewLink}${file.title}`,
                file.thumbnailLink));
          }
          this.$scope_.$apply(() => undefined);
        });
  }

  /**
   * Resources that have been loaded.
   */
  get resources(): ImageResource[] {
    return this.resources_;
  }

  /**
   * URL to load the resources.
   */
  get resourceURL(): string {
    return this.resourceUrl_;
  }
  set resourceURL(resourceUrl: string) {
    this.resourceUrl_ = resourceUrl;
    this.updateResources_(resourceUrl);
  }

  /**
   * Images that are selected.
   */
  get selectedImages(): ImageResource[] {
    return this.selectedImages_;
  }
  set selectedImages(selectedImages: ImageResource[]) {
    this.selectedImages_ = selectedImages;
  }

  /**
   * @return True iff there are images being selected.
   */
  hasSelected(): boolean {
    return this.selectedImages_.length > 0;
  }

  /**
   * Handler called when the delete button is clicked.
   */
  onDeleteClick(): void {
    for (let selectedImage of this.selectedImages_) {
      let index = this.resources_.indexOf(selectedImage);
      this.resources_.splice(index, 1);
    }
    this.selectedImages_ = [];
  }

  /**
   * Handler called when the OK button is clicked.
   */
  onOkClick(): void {
    this.$mdDialog_.hide(this.resources_);
  }

  /**
   * Handler called when the Cancel button is clicked.
   */
  onCancelClick(): void {
    this.$mdDialog_.cancel();
  }
}
