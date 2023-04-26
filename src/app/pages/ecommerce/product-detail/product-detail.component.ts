import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Products Services
import { restApiService } from "../../../core/services/rest-api.service";

// Swiper Slider
import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';

import { productModel, productList } from '../product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

/**
 * ProductDetail Component
 */
export class ProductDetailComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public productDetail!: productModel[];
  isImage;
  defaultSelect = 2;
  readonly = false;
  content?: any;
  products: any;

  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;

  constructor(private route: ActivatedRoute, private modalService: NgbModal, public restApiService: restApiService) {
    // const id = '62a2c84c79c9c10875c24a54';
    // this.restApiService.getProductDetails(id).subscribe({
    //   next: data => {        
    //     const users =  JSON.parse(data);
    //     this.content = users.data;

    //   },
    //   error: err => {
    //     this.content = JSON.parse(err.error).message;
    //   }
    // });
    this.products = this.route.snapshot.params
    this.route.params.subscribe(params =>
      this.productDetail = productList.filter(function (product) {
        return product.id == parseInt(params['any'])
      })
    );
    this.isImage = this.productDetail[0].images[0];
  }

  ngOnInit(): void {
    /**
   * BreadCrumb
   */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Product Details', active: true }
    ];
  }

  /**
   * Swiper setting
   */
  config = {
    initialSlide: 0,
    slidesPerView: 1,
  };

  /**
   * Swiper card previous set
   */
  previousSlideComp() {
    this.componentRef!.directiveRef!.prevSlide();
  }

  /**
   * Swiper card next set
   */
  nextSlideComp() {
    this.componentRef!.directiveRef!.nextSlide();
  }

}
