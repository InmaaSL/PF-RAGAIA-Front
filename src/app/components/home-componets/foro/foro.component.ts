import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewPostComponent } from '../../modal-components/new-post/new-post.component';
import { HttpClient } from '@angular/common/http';
import { PostService } from 'src/app/services/post.service';
import { HomeService } from 'src/app/services/home.service';
import { ComponentsService } from 'src/app/services/components.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit, AfterViewInit {

  public posts = [];

  public loading: boolean = false;

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

  public getPost(){
    this.postService.getAllPost().subscribe({
      next: (posts: any) => this.posts = posts,
      error: (e) => console.log(e),
      complete: () => this.loading = true
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
