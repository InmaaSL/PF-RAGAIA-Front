import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  public postForm!: FormGroup;
  public topics = [];

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    public dialog: MatDialog,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      topic: ['', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.getTopic();
  }

  public onSubmit() {
    if (this.postForm?.valid) {
      const postInfo = new HttpParams()
      .set('topic', this.postForm.value.topic ?? '' )
      .set('title', this.postForm.value.title ?? '' )
      .set('message', this.postForm.value.message ?? '' )

      this.postService.savePost(postInfo).subscribe({
        error: (e) => {
          this.alertService.setAlert('Error al guardar el post.', 'danger');
        },
        complete: () => {
          this.alertService.setAlert('Post publicado.', 'success');
          this.postForm.reset();
          this.dialog.closeAll();
        }
      })
    }
  }

  public getTopic(){
    this.postService.getTopicPost().subscribe({
      next: (topics: any) => {
        this.topics = topics;
      }
    })
  }

}
