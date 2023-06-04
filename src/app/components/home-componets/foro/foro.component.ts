import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewPostComponent } from '../../modal-components/new-post/new-post.component';
import { MatPaginator } from '@angular/material/paginator';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { RestService } from 'src/app/services/rest/Rest.Service';
import { HttpClient } from '@angular/common/http';
import { Filtering } from 'src/app/services/rest/Filtering';
import { MainService } from 'src/app/services/main.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { HomeService } from 'src/app/services/home.service';
import { ComponentsService } from 'src/app/services/components.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined = undefined;

  public dataSource!: CommonDataSource;
  public restService!: RestService;

  public posts = [];

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private postService: PostService,
    private homeService: HomeService,
    private componentsService: ComponentsService

  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getPost();
  }

connectToDataSource(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.dataSource.connect(collectionViewer);
}

  public getPost(){
    this.postService.getAllPost().subscribe({
      next: (posts: any) => this.posts = posts,
      error: (e) => console.log(e)
    })
  }


  public newPost(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '55%';
    dialogConfig.height = '70%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(NewPostComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getPost();
    });
  }

  public deletePost(id: string){
    this.postService.deletePost(id).subscribe({
      error: (e) => console.log(e),
      complete: () => {
        console.log('Post eliminado');
        this.getPost();
      }
    })
  }

  public isOlderThanTwoWeeks(post: any): boolean {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const postDate = new Date(post.date);
    return postDate < twoWeeksAgo;
  }

  public isYoungerThanTwoWeeks(post: any): boolean {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const postDate = new Date(post.date);
    return postDate > twoWeeksAgo;
  }

  public goToPost(id: string){
    this.componentsService.updateSelectedUser(id);
    this.homeService.updateSelectedComponent('individual-post');
  }


}
