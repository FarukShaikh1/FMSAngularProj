import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CurrencyCoinService } from '../Services/currency-coin/currency-coin.service';
import { HttpClient } from '@angular/common/http';
import * as constants from '../constants/constants';
import { AssetService } from '../Services/asset/asset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../Services/global/global.service'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-coin-details.component.html',
  styleUrls: ['./currency-coin-details.component.scss']
})

export class CurrencyCoinDetailsComponent implements OnInit {
  currencyCoinDetailsForm: FormGroup;
  user: any;
  countryList:any;
  collectionCoinId: number = 0;
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  fil: File | null = null;
  formData: FormData = new FormData();
  currencyCoinDetails: any;
  assetDetails: any;

  constructor(private _details: FormBuilder, private _currencyCoinService: CurrencyCoinService, private _httpClient: HttpClient, private route: ActivatedRoute,
    private router: Router, private _dialogRef: MatDialogRef<CurrencyCoinDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _globalService: GlobalService, private _assetService: AssetService,
    private datepipe: DatePipe
  ) {
    this.currencyCoinDetailsForm = this._details.group<any>({
      collectionCoinId: 0,
      collectionCoinName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z. ]{3,40}$/)]],
      countryId: [0, Validators.required],
      mobileNumber: ['', Validators.pattern(/^[0-9]{8,12}$/)],
      contactNumber: ['', Validators.pattern(/^[0-9]{8,12}$/)],
      address: '',
      assetId: 0,
      image: null

    })
  }

  onDragOver(event: any) {
    event.preventDefault();
  }
  onDrop(event: any) {
    event.preventDefault();
    this.handleImageDrop(event.dataTransfer.files);
  }
  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.handleImageDrop(inputElement.files);
  }

  private handleImageDrop(files: FileList | null): void {
    if (files && files.length > 0) {

      const file = files[0];
      this.selectedImageFile = files[0];
      if (file.type.startsWith('image/')) {
        this.formData.append('file', file);

        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  }

  ngOnInit(): void {
    if (this.data) {
      console.log('this.data : ',this.data);
      
      if (isNaN(this.data)) {
      console.log('this.data : ',this.data);
      this.patchValues(this.data);
      }
      else if (this.data == 0) {
      }
      else {
        console.log('in else');
        
        this.getCurrencyCoinDetails(this.data);
        if (this.currencyCoinDetails && this.currencyCoinDetails.AssetId) {

        }
      }
    }
  }

  getCurrencyCoinDetails(collectionCoinId: number) {
    this._currencyCoinService.getCurrencyCoinDetails(collectionCoinId).subscribe((res: any) => {
      this.currencyCoinDetails = res[0]; 
      console.log( 'this.currencyCoinDetails : ',this.currencyCoinDetails);
      console.log( 'res[0] : ',res);
      
      this.patchValues(res);
      // if (this.currencyCoinDetails.AssetId) {
      //   this.getAssetDetails(this.currencyCoinDetails.AssetId);
      // }
    }
    )
  }
  getAssetDetails(assetId: number) {
    this._assetService.getAssetDetails(assetId).subscribe((res: any) => {
      this.selectedImage = constants.ATTACHMENT + res.OriginalPath;
    }
    )

  }

  patchValues(res: any) {
    if (res != undefined) {
      this.currencyCoinDetailsForm.controls['collectionCoinId'].patchValue(res['BirthcollectionCoinId']);
      // this.currencyCoinDetailsForm.controls['commonListItemId'].patchValue(res['CommonListItemId']);
      this.currencyCoinDetailsForm.controls['collectionCoinName'].patchValue(res['CollectionCoinName']);
      this.currencyCoinDetailsForm.controls['countryId'].patchValue(res['CountryId']);
      this.currencyCoinDetailsForm.controls['coinWeightInGrams'].patchValue(res['CoinWeightInGrams']);
      this.currencyCoinDetailsForm.controls['actualValue'].patchValue(res['ActualValue']);
      this.currencyCoinDetailsForm.controls['indianValue'].patchValue(res['IndianValue']);
      this.currencyCoinDetailsForm.controls['printedYear'].patchValue(res['PrintedYear']);
      this.currencyCoinDetailsForm.controls['speciality'].patchValue(res['Speciality']);
      this.currencyCoinDetailsForm.controls['diameterOfCoin'].patchValue(res['DiameterOfCoin']);
      this.currencyCoinDetailsForm.controls['lengthOfNote'].patchValue(res['LengthOfNote']);
      this.currencyCoinDetailsForm.controls['breadthOfNote'].patchValue(res['BreadthOfNote']);
      this.currencyCoinDetailsForm.controls['description'].patchValue(res['Description']);
      this.currencyCoinDetailsForm.controls['metalUsed'].patchValue(res['MetalUsed']);
      this.currencyCoinDetailsForm.controls['image'].patchValue(res['Image']);
      this.currencyCoinDetailsForm.controls['assetId'].patchValue(res['AssetId']);
      this.currencyCoinDetailsForm.controls['isVerified'].patchValue(res['IsVerified']);
      this.currencyCoinDetailsForm.controls['isEditable'].patchValue(res['IsEditable']);
    }
  }

  submitCurrencyCoinDetails() {
    if (!this.currencyCoinDetailsForm.valid) {
      this._globalService.openSnackBar('Some issue is there');
      return;
    }
    else {
      try {
        const selectedDate = new Date(this.currencyCoinDetailsForm.value['birthdate']);
        this.currencyCoinDetailsForm.value['birthdate'] = this.datepipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss');
        if (this.formData) {
          this.addImage();
        }

      } catch (error) {
        this._globalService.openSnackBar("Error in adding data : " + error);
        console.error("Error in adding data : ", error);
      }
    }
  }


  addCurrencyCoinDetails() {
    this._currencyCoinService.addCurrencyCoin(this.currencyCoinDetailsForm.value).subscribe((result) => {
      if (result) {
        this._globalService.openSnackBar("Record added successfully");
        this._dialogRef.close(true);
      }
      else
        this._globalService.openSnackBar('some issue is in adding the data');
    });
  }
  updateCurrencyCoinDetails() {
    this._currencyCoinService.updateCurrencyCoin(this.currencyCoinDetailsForm.value).subscribe((result) => {
      if (result) {
        this._globalService.openSnackBar("Record updated successfully");
        this._dialogRef.close(true);
      }
      else
        this._globalService.openSnackBar('some issue is in updating the data');
    });
  }

  addOrUpdateCurrencyCoinDetails() {
    if (this.currencyCoinDetailsForm.value['collectionCoinId'] > 0) {
      this.updateCurrencyCoinDetails()
    }
    else {
      this.addCurrencyCoinDetails();
    }
  }
  addImage() {
    if (this.selectedImageFile) {

      this._currencyCoinService.uploadImage(this.currencyCoinDetailsForm.value['assetId'], 'Collection_Coins', this.formData).subscribe((response) => {
        this.currencyCoinDetailsForm.value['assetId'] = response;
        this.addOrUpdateCurrencyCoinDetails();
      });
    }
    else {
      this.addOrUpdateCurrencyCoinDetails();
    }
  }

}