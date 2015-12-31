import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import Extract from '../convert/extract';
import File from '../model/file';
import { FileTypes } from '../model/file';

export default class TextCtrl {
  private asset_: Asset;
  private assetService_: AssetService;
  private parsedData_: string[][];

  constructor($scope: angular.IScope, AssetService: AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.parsedData_ = null;
  }

  get data(): File {
    return this.asset_.data;
  }
  set data(newFile: File) {
    this.asset_.data = newFile;
    this.assetService_.saveAsset(this.asset_);
    this.parsedData_ = null;
  }

  get parsedData(): string[][] {
    if (this.parsedData_ === null) {
      // TODO(gs): Move to Extract.
      this.parsedData_ = this.asset_.data.content
          .split('\n')
          .map(line => line.split('\t'));
    }
    return this.parsedData_;
  }

  hasData(): boolean {
    return !!this.asset_.data;
  }
}
