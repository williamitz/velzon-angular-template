import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GlobalComponent } from '../../../global-component';

// Products Services
import { restApiService } from "../../../core/services/rest-api.service";

// Range Slider
import { Options } from '@angular-slider/ngx-slider';

// Sweet Alert
import Swal from 'sweetalert2';

import { Products } from './data';
import { productModel } from './products.model';
import { AdvancedService } from './products.service';
import { NgbdProductsSortableHeader, SortEvent } from './products-sortable.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})

/**
 * Products Components
 */
export class ProductsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  // Table data

  // total$: Observable<number>;
  @ViewChildren(NgbdProductsSortableHeader) headers!: QueryList<NgbdProductsSortableHeader>;
  url = GlobalComponent.API_URL;
  user = [];
  Brand: any = [];
  Rating: any = [];
  discountRates: number[] = [];
  contactsForm!: UntypedFormGroup;
  content!: productModel[];
  products: any;
  total: any;
  totalbrand: any;
  totalrate: any;
  totaldiscount: any;
  allproduct: any;
  page = 1;
  pageSize = 5;
  searchTerm = '';
  sortColumn = '';
  sortDirection = '';
  startIndex = 0;
  endIndex = 9;
  totalRecords = 0
  totalpublishRecords = 0;
  allproducts: any;
  publishedproduct: any;
  searchproducts: any;
  totalpublish: any;
  activeindex = '1';
  allpublish: any;
  grocery: any = 0;
  fashion: any = 0;
  watches: any = 0;
  electronics: any = 0;
  furniture: any = 0;
  accessories: any = 0;
  appliance: any = 0;
  kids: any = 0;

  constructor(private modalService: NgbModal,
    public restApiService: restApiService,
    private formBuilder: UntypedFormBuilder,
    private service: AdvancedService,
    private router: Router) {
    // this.total$ = service.total$;

    ;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Products', active: true }
    ];

    // Api Data
    setTimeout(() => {
      this.publishedproduct = []
      this.restApiService.getData().subscribe(
        data => {
          const users = JSON.parse(data);
          this.allproducts = users.data;
          this.totalRecords = this.allproducts.length;
          this.startIndex = (this.page - 1) * this.pageSize + 1;
          this.endIndex = (this.page - 1) * this.pageSize + this.pageSize;
          if (this.endIndex > this.totalRecords) {
            this.endIndex = this.totalRecords;
          }
          this.products = this.allproducts.slice(this.startIndex - 1, this.endIndex);
          this.searchproducts = this.products
          this.total = this.allproducts.length;
          for (var i = 0; i < this.allproducts.length; i++) {
            if (this.allproducts[i].category == 'Kitchen Storage & Containers') {
              this.grocery += 1
            }
            if (this.allproducts[i].category == 'Clothes') {
              this.fashion += 1
            }
            if (this.allproducts[i].category == 'Watches') {
              this.watches += 1
            } if (this.allproducts[i].category == 'Electronics') {
              this.electronics += 1
            } if (this.allproducts[i].category == 'Furniture') {
              this.furniture += 1
            } if (this.allproducts[i].category == 'Bike Accessories') {
              this.accessories += 1
            }
            if (this.allproducts[i].category == 'Tableware & Dinnerware') {
              this.appliance += 1
            }
            if (this.allproducts[i].category == 'Bags, Wallets and Luggage') {
              this.kids += 1
            }
            if (this.allproducts[i].status == 'published') {
              this.publishedproduct.push(this.allproducts[i])
            }
            this.allpublish = this.publishedproduct
            this.publishedproduct = this.publishedproduct.slice(this.startIndex - 1, this.endIndex);
            this.totalpublish = this.publishedproduct.length;
            this.totalpublishRecords = this.publishedproduct.length;
          }
          document.getElementById('elmLoader')?.classList.add('d-none')
        })
    }, 1500);

    /**
     * Form Validation
     */
    this.contactsForm = this.formBuilder.group({
      subItem: this.formBuilder.array([]),
    });
  }

  /**
    * Pagination
    */
  loadPage(page: number) {
    this.startIndex = (this.page - 1) * this.pageSize + 1;
    this.endIndex = (this.page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.products = this.allproducts.slice(this.startIndex - 1, this.endIndex);
  }

  /**
   * change navigation
   */
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      this.activeindex = '1'
    }
    if (changeEvent.nextId === 2) {
      this.activeindex = '2'
    }
    if (changeEvent.nextId === 3) {
      this.activeindex = '3'
    }
  }

  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // this.service.sortColumn = column;
    // this.service.sortDirection = direction;
  }

  // Price Slider
  minValue = 0;
  maxValue = 1000;
  pricevalue = 100;
  options: Options = {
    floor: 0,
    ceil: 1000
  };

  /**
   * Default Select2
   */
  multiDefaultOption = 'Watches';
  selectedAccount = 'This is a placeholder';
  Default = [
    { name: 'Watches' },
    { name: 'Headset' },
    { name: 'Sweatshirt' },
  ];

  /**
  * Brand Filter
  */
  changeBrand(e: any) {
    if (e.target.checked) {
      this.Brand.push(e.target.defaultValue)
    } else {
      for (var i = 0; i < this.Brand.length; i++) {
        if (this.Brand[i] === e.target.defaultValue) {
          this.Brand.splice(i, 1)
        }
      }
    }
    this.totalbrand = this.Brand.length
  }

  /**
  * Discount Filter
  */
  changeDiscount(e: any) {
    if (e.target.checked) {
      this.discountRates.push(e.target.defaultValue)

      // this.productList.subscribe(x => {
      //   this.products = x.filter((product: any) => {
      //     return product.rating > e.target.defaultValue;
      //   });
      // });
    } else {
      for (var i = 0; i < this.discountRates.length; i++) {
        if (this.discountRates[i] === e.target.defaultValue) {
          this.discountRates.splice(i, 1)
        }
      }
    }
    this.totaldiscount = this.discountRates.length
  }


  /**
   * Rating Filter
   */
  changeRating(e: any, rate: any) {
    if (e.target.checked) {
      this.Rating.push(e.target.defaultValue)
      this.products = this.allproducts.filter((product: any) => {
        return product.rating > rate;
      });
    }
    else {
      for (var i = 0; i < this.Rating.length; i++) {
        if (this.Rating[i] === e.target.defaultValue) {
          this.Rating.splice(i, 1)
        }
      }
      if (this.activeindex == '1') {
        this.products = this.allproducts.filter((product: any) => {
          return product.discount !== rate;
        });
        this.total = this.products.length;
        this.pageSize = this.products.length;
      } else if (this.activeindex == '2') {
        this.publishedproduct = this.allpublish.filter((product: any) => {
          return product.discount !== rate;
        });
        this.totalpublish = this.publishedproduct.length;
        this.pageSize = this.publishedproduct.length;
      }
    }
    this.totalrate = this.Rating.length
  }

  /**
   * Product Filtering  
   */
  changeProducts(e: any, name: any, category: any) {
    const iconItems = document.querySelectorAll('.filter-list');
    iconItems.forEach((item: any) => {
      var el = item.querySelectorAll('a')
      el.forEach((item: any) => {
        var element = item.querySelector('h5').innerHTML
        if (element == category) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      })
    });

    if (this.activeindex == '1') {
      this.products = this.allproducts.filter((product: any) => {
        return product.category === name;
      })
      this.total = this.products.length;
      this.endIndex = this.products.length;
      if (this.total == 0) {
        document.querySelector('.alltable')?.classList.remove('d-none')
        document.querySelector('.pagination')?.classList.add('d-none')
      } else {
        document.querySelector('.alltable')?.classList.add('d-none')
        document.querySelector('.pagination')?.classList.remove('d-none')
      }
    } else if (this.activeindex == '2') {
      this.publishedproduct = this.allpublish.filter((product: any) => {
        return product.category === name;
      })
      this.totalpublish = this.publishedproduct.length;
      this.endIndex = this.publishedproduct.length;
      if (this.totalpublish == 0) {
        document.querySelector('.alltable')?.classList.remove('d-none')
        document.querySelector('.pagination')?.classList.add('d-none')
      } else {
        document.querySelector('.alltable')?.classList.add('d-none')
        document.querySelector('.pagination')?.classList.remove('d-none')
      }
    }
  }

  /**
  * Search Product
  */
  search(value: string) {
    if (this.activeindex == '1') {
      if (value) {
        this.products = this.allproducts.filter((val: any) =>
          val.category.toLowerCase().includes(value)
        );
        this.total = this.products.length;
      } else {
        this.products = this.searchproducts
        this.total = this.allproducts.length;
      }
    } else if (this.activeindex == '2') {
      if (value) {
        this.publishedproduct = this.publishedproduct.filter((val: any) =>
          val.category.toLowerCase().includes(value)
        );
        this.total = this.publishedproduct.length;
      } else {
        this.publishedproduct = this.allpublish
        this.total = this.publishedproduct.length;
      }
    }
  }

  /**
  * Range Slider Wise Data Filter
  */
  valueChange(value: number, boundary: boolean): void {
    if (value > 0 && value < 1000) {
      if (this.activeindex == '1') {
        if (boundary) {
          this.minValue = value;
        } else {
          this.maxValue = value;
          this.products = this.allproducts.filter((product: any) => {
            return product.price >= this.minValue && product.price <= this.maxValue;
          });
          this.total = this.products.length;
          this.pageSize = this.products.length;
        }
      } else if (this.activeindex == '2') {
        if (boundary) {
          this.minValue = value;
        } else {
          this.maxValue = value;
          this.publishedproduct = this.allpublish.filter((product: any) => {
            return product.price >= this.minValue && product.price <= this.maxValue;
          });
          this.totalpublish = this.publishedproduct.length;
          this.pageSize = this.publishedproduct.length;
        }
      }
    }
  }

  /**
  * Delete Model Open
  */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.restApiService.deleteData(id).subscribe({
        next: data => { },
        error: err => {
          this.content = JSON.parse(err.error).message;
        }
      });
      document.getElementById('p_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('p_' + item)?.remove();
      });
      (document.getElementById("selection-element") as HTMLElement).style.display = "none"
    }
  }

  // Check Box Checked Value Get
  checkedValGet: any[] = [];
  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    var checkBoxCount: any = document.getElementById('select-content') as HTMLElement;
    checkBoxCount.innerHTML = checkedVal.length;
    checkedVal.length > 0 ? (document.getElementById("selection-element") as HTMLElement).style.display = "block" : (document.getElementById("selection-element") as HTMLElement).style.display = "none";
  }

  clearall(ev: any) {
    this.minValue = 0;
    this.maxValue = 1000;
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false
    }
    // this.service.searchTerm = ''
    this.totalbrand = 0;
    this.totaldiscount = 0;
    this.totalrate = 0;
    this.Brand = []
    this.Rating = []
    this.discountRates = []
    this.pageSize = 5
    this.endIndex = this.totalRecords
    this.endIndex = this.totalpublishRecords
    this.products = this.allproducts.slice(this.startIndex - 1, this.endIndex);
    this.total = this.allproducts.length
    this.publishedproduct = this.allpublish.slice(this.startIndex - 1, this.endIndex);
    this.totalpublish = this.publishedproduct.length
    const iconItems = document.querySelectorAll('.filter-list');
    iconItems.forEach((item: any) => {
      var el = item.querySelectorAll('a')
      el.forEach((item: any) => {
        item.classList.remove("active");
      })
    });
  }

  godetail(id: any) {
    this.router.navigate(['/ecommerce/product-detail/1', this.products[id]])
  }

}
