import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import {
  ApiCarActiveResponse,
  ApiCarHistoryListing,
  ApiCarVINDecoder,
  ApiCarMDSResponse,
  ApiListingCarResponse,
  ApiPopularCar,
  ApiCarVINDecoderEpi,
} from "./api";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private rootUrl = "https://marketcheck-prod.apigee.net/oauth/v2/";

  constructor(private http: HttpClient) {}

  getCarActive(queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + "search/car/active";

    return this.http.get<ApiCarActiveResponse>(url, { params, headers });
  }

  getCarHistoryByVin(vin: string, queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + `history/car/${vin}`;

    return this.http.get<ApiCarHistoryListing[]>(url, { params, headers });
  }

  decodeCarByVin(vin: string, queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + `decode/car/${vin}/specs/`;

    return this.http.get<ApiCarVINDecoder>(url, { params, headers });
  }

  getCarMDS(queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + `mds/car`;

    return this.http.get<ApiCarMDSResponse>(url, { params, headers });
  }

  getListingByID(mc_listing_id: string, queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + `listing/car/${mc_listing_id}`;

    return this.http.get<ApiListingCarResponse[]>(url, { params, headers });
  }

  getPopularCars(queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + `popular/cars`;

    return this.http.get<ApiPopularCar[]>(url, { params, headers });
  }

  decodeCarByVinAdvanced(vin: string, queryParams: Object) {
    const params = this.getParams(queryParams);
    const headers = this.getHeaders(queryParams);
    const url = this.rootUrl + `decode/car/epi/${vin}/specs/`;

    return this.http.get<ApiCarVINDecoderEpi>(url, { params, headers });
  }

  private getParams(queryParams: Object) {
    let params = new HttpParams();

    if (Object.keys(queryParams).length > 0) {
      Object.entries(queryParams).forEach((entry) => {
        const [key, val] = entry;
        if (
          key !== "access_token" &&
          key !== "identity" &&
          this.isValidVal(val)
        ) {
          params = params.append(key, val);
        }
      });
    }
    return params;
  }

  private getHeaders(queryParams: Object) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${queryParams["access_token"]}`,
      "x-mc-widget": queryParams["identity"] || "-1",
    });
    return headers;
  }

  private isValidVal(val: any): boolean {
    if (
      val !== "" &&
      val !== undefined &&
      val !== null &&
      val !== "null" &&
      val !== "undefined"
    ) {
      return true;
    } else {
      return false;
    }
  }
}
