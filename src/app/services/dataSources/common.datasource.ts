/* eslint-disable @typescript-eslint/dot-notation */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { RestService } from '../rest/Rest.Service';

export class CommonDataSource implements DataSource<any> {

    public numItems = 0;

    public paginator: MatPaginator | undefined;

    public loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    private resultsSubject = new BehaviorSubject<any[]>([]);

    constructor(public restService: RestService) {}

    loadData(
    ) {
        this.loadingSubject.next(true);

        this.restService.setPage().then((data: any) => {
            if (this.paginator) {
                this.paginator.length = data['count'];
            }
            this.numItems = data['count'];
            this.resultsSubject.next(data['data']);
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.resultsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.resultsSubject.complete();
        this.loadingSubject.complete();
    }
}
