import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import DriveDialogModule, { DriveDialogService } from '../editor/drive-dialog';
import ImageNode from '../pipeline/image-node';
import ImageResource from '../model/image-resource';
import ImageSelectModule from '../editor/image-select';
import Provider from '../util/provider';


export class ImageCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private assetService_: AssetService;
  private driveDialogService_: DriveDialogService;
  private imageNode_: ImageNode;
  private selectedImages_: ImageResource[];

  /**
   * @param {!editor.DriveDialogService} DriveDialogService
   */
  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService,
      DriveDialogService: DriveDialogService) {
    this.$scope_ = $scope;
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
    this.driveDialogService_ = DriveDialogService;
    this.selectedImages_ = [];
  }

  $onInit(): void {
    this.imageNode_ = this.assetPipelineService_.getPipeline(this.asset.id).imageNode;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  /**
   * @return True iff there are selected images.
   */
  hasSelectedImages(): boolean {
    return this.selectedImages_.length > 0;
  }

  @Cache()
  get images(): Provider<ImageResource[]> {
    return new Provider(
        this.$scope_,
        this.imageNode_.result
            .then((imageMap: { [key: string]: ImageResource }) => {
              let array = [];
              for (let key in imageMap) {
                array.push(imageMap[key]);
              }
              return array;
            }),
        []);
  }

  /**
   * Handler called when the delete button is clicked.
   */
  onDeleteClick(): void {
    for (let selected of this.selectedImages_) {
      delete this.asset_.images[selected.alias];
    }
    this.selectedImages_ = [];
    Cache.clear(this);
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when the drive button is clicked.
   * @param $event The Angular event.
   * @return Promise that will be resolved when the dialog has been closed.
   */
  onDriveClick($event: MouseEvent): angular.IPromise<void> {
    return this.driveDialogService_
        .show($event)
        .then((images: ImageResource[]) => {
          images.forEach((image: ImageResource) => {
            this.asset_.images[image.alias] = image;
          });
          this.assetService_.saveAsset(this.asset_);
          Cache.clear(this);
        });
  }

  get selectedImages(): ImageResource[] {
    return this.selectedImages_;
  }
  set selectedImages(images: ImageResource[]) {
    this.selectedImages_ = images;
  }
}


export default angular
    .module('image.ImageModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      DriveDialogModule.name,
      ImageSelectModule.name,
    ])
    .component('pcImage', {
      bindings: {
        'asset': '<',
      },
      controller: ImageCtrl,
      templateUrl: 'src/image/image.ng',
    });
