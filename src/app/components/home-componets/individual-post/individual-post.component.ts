import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentsService } from 'src/app/services/components.service';
import { HomeService } from 'src/app/services/home.service';
import { PostService } from 'src/app/services/post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-individual-post',
  templateUrl: './individual-post.component.html',
  styleUrls: ['./individual-post.component.css']
})
export class IndividualPostComponent implements OnInit {

  public post_id = '';
  public post: any = [];
  public messages: any = [];

  public colorAlternative = false;
  public isOld: boolean = false;
  public loadingPost: boolean = false;

  public postForm!: FormGroup;

  constructor(
    private postService: PostService,
    private homeService: HomeService,
    private componentsService: ComponentsService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.post_id = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    this.postForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

    this.getPostInfo();
    this.getPostMessages();
  }

  public onSubmit() {
    if (this.postForm?.valid) {
      console.log(this.postForm.value);
      const messageInfo = new HttpParams()
      .set('message', this.postForm.value.message ?? '' )

      this.postService.savePostMessage(this.post_id, messageInfo).subscribe({
        error: (e) => console.log(e),
        complete: () => {
          this.postForm.reset();
          this.getPostMessages();
        }
      })
    }
  }

  public getPostInfo(){
    this.postService.getThisPost(this.post_id).subscribe({
      next: (post: any) => {
        this.loadingPost = true;
        this.post = post;
        this.isOld = this.isOlderThanThreeWeeks(this.post);
      },
      error: (e) => console.log(e)
    })
  }

  public isOlderThanThreeWeeks(post: any): boolean {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 21);

    const postDate = new Date(post.date);
    return postDate < twoWeeksAgo;
  }


  public getPostMessages(){
    this.postService.getPostMessages(this.post_id).subscribe({
      next: (postMessages: any) => {
        this.messages = postMessages;
      },
      error: (e) => console.log(e)
    })
  }

  changeColor() {
    this.colorAlternative = !this.colorAlternative;
  }

  public goBack(){
    this.homeService.updateSelectedComponent('foro');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }
}
