/* eslint-disable eqeqeq */
import {ChangeDetectorRef, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MainService} from '../main.service';
import {TablePage} from './TablePage';
import {Sorting} from './Sorting';
import {Filtering} from './Filtering';
import {PageEvent} from '@angular/material/paginator';
import { API_URL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})

export class RestService {
    public count: number | undefined;
    public data: any[] = [];
    public page: TablePage;
    public loading: boolean = false;
    public sort: Sorting[] = [];
    public filter: Filtering[] = [];
    public filterDefault: Filtering[] = [];
    public setPageCallBack: any;
    public setPageCallBack2: any;
    public url!: string;
    selected = [];
    baseUrl = API_URL;

    /**
     *
     */
    constructor(
        private http: HttpClient,
        private changeDetectorRef: ChangeDetectorRef
        ) {
        this.page = new TablePage();
    }

    reset() {
        this.data = [];
        this.sort = [];
        this.filter = [];
        this.page = new TablePage();
    }

    /**
     * Get data using pagination and sorting
     *
     * @param pageInfo
     */
    setPage(pageInfo = this.page) {
        this.page = pageInfo;
        this.loading = true;
        const url = `${this.baseUrl}/${this.url}/0`;
        let params = new HttpParams();
        params = params.append('p', pageInfo.offset.toString());
        params = params.append('c', pageInfo.limit.toString());
        if (this.sort && this.sort.length) {
            params = params.append('s', JSON.stringify(this.sort));
        }
        if (this.isFilterUsed()) {
            // eslint-disable-next-line prefer-const
            let fToSend = MainService.deepCopy(this.filter);
            fToSend.forEach((f: { value: any[]; }) => {
                if (f.value && Array.isArray(f.value) && f.value.length) {
                    f.value = f.value.map(v => ({id: v.id}));
                }
            });
            params = params.append('f', JSON.stringify(fToSend));
        }

        const promise = new Promise((resolve, reject) => {
            this.http.get(url, {params}).subscribe((r: any) => {
                this.data = r.data;
                pageInfo.count = r.count;
                if (this.setPageCallBack) {this.setPageCallBack(r);}
                if (this.setPageCallBack2) {this.setPageCallBack2(r);}
                this.loading = false;
                this.changeDetectorRef.detectChanges();
                resolve(r);
            });
        });

        return promise;
    }

    setPageFromPageEvent(event: PageEvent) {
        this.page.count = event.length;
        this.page.limit = event.pageSize;
        this.page.totalPages = event.length / event.pageSize;
        this.page.offset = event.pageIndex;
        this.setPage();
    }

    cleanSearch() {
        this.page = new TablePage();
        this.setPage();
    }

    searchKeyDown(event: { key: string; }) {
      if (event.key === 'Enter') {this.cleanSearch();}
  }

    onSort(ev: { sorts: Sorting[]; }) {
        this.sort = ev.sorts;
        this.cleanSearch();
    }

    defineFilter(filter: Filtering[]) {
        this.filterDefault = filter;
        this.filter = MainService.deepCopy(filter);
    }

    isFilterUsed() {
        if (this.filter) {
            return this.filter.find(f => Array.isArray(f.value) ? f.value.length > 0 : f.value !== null);
        } else {return false;}
    }

    clearFilter() {
        this.filter = MainService.deepCopy(this.filterDefault);
        this.setPage();
    }

    clearResultBut(id: number) {
        if (this.data && this.data.length) {
            this.data = this.data.filter(e => id == e.id);
            this.setPageOne();
        }
    }

    clearResult() {
        this.data = [];
        this.selected = [];
        this.setPageOne(0);
    }

    setPageOne(count = 1) {
        this.page.count = count;
        this.page.totalPages = 0;
        this.page.offset = 0;
        this.changeDetectorRef.detectChanges();
    }

  //   selectFirst() {
  //     this.selected = [this.data[0]];
  // }

    setResult(forcedData: any) {
        if (forcedData) {
            this.data = [forcedData];
            if (this.setPageCallBack) {this.setPageCallBack({data: this.data});}
            if (this.setPageCallBack2) {this.setPageCallBack2({data: this.data});}
            this.setPageOne();
        }
    }
}
