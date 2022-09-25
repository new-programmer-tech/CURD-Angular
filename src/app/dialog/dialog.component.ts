import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  // dataSource!: MatTableDataSource<any>;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort

  freshnessList = ["Brand New" , "Second Hand" ,"Refurbished"];
  productForm !: FormGroup;
  actionBtn :string = 'Save';
  constructor(private formBuilder:FormBuilder,
    private api :ApiService ,
    @Inject(MAT_DIALOG_DATA) public edit : any,
    private dialogRef : MatDialogRef<DialogComponent>
    ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName :['',Validators.required],
      category:['',Validators.required],
      freshness:['',Validators.required],
      price:['',Validators.required],
      comment:['',Validators.required],
      date:['',Validators.required],
    });

    console.log(this.edit);

    if(this.edit){
      this.actionBtn = "Update";
      console.log("values true")
      this.productForm.controls['productName'].setValue(this.edit.productName);
      this.productForm.controls['category'].setValue(this.edit.category);
      this.productForm.controls['freshness'].setValue(this.edit.freshness);
      this.productForm.controls['price'].setValue(this.edit.price);
      this.productForm.controls['comment'].setValue(this.edit.comment);
      this.productForm.controls['date'].setValue(this.edit.date);
    }

  }

  addProducts(){
     if(!this.edit){
      if (this.productForm.valid){
        this.api.postProduct(this.productForm.value).
        subscribe({
          next:(res)=>{
            alert("Product Added");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error While Adding product")
          }
        })
       }
     }else{
      this.updateProduct()
     }
  }


  updateProduct(){
    this.api.putProduct(this.productForm.value, this.edit.id).subscribe(
      {
        next:(res)=>{
          this.api.getProduct().subscribe({
            next:(res)=> {
              console.log(res);
              this.dataSource = new MatTableDataSource(res);
              this.dataSource.paginator =this.paginator;
              this.dataSource.sort = this.sort;
            },
            error:()=>{
              alert("Error while fetching data")
            }
          })
          alert("Product Updated Successfully");
          this.productForm.reset();
          this.dialogRef.close('update');
          
        },
        error:()=>{
          alert("Error While Updating");
        }
      }
    )
  }


  // addProducts(){
  //   alert("hello");
  //   console.log(this.productForm.value);

  // }

}



