import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from './service/api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'curd';

  displayedColumns: string[] = ['productName', 'category', 'date','freshness', 'price', 'comment' , 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  constructor(private dialog: MatDialog , private api : ApiService)
  {

  }
  ngOnInit(): void {
    this.getAllProducts();
  }


  openDialog() {
    this.dialog.open(DialogComponent, {
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllProducts();
      }
    })
  }


  getAllProducts(){
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
  }

  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'60%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=>{
        alert("Deleted");
        this.getAllProducts();
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  


}


