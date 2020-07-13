import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreateTaskInput, TaskServiceProxy, PersonServiceProxy, PersonDto, GetAllPeopleOutput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html'
})
export class CreateTaskDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  people: PersonDto[] = [];
  task: CreateTaskInput = new CreateTaskInput();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _taskServiceProxy: TaskServiceProxy,
    public _personServiceProxy: PersonServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._personServiceProxy
      .getAllPeople().subscribe((result: GetAllPeopleOutput) => {
        this.people = result.people;
      });
  }

  save(): void {
    this.saving = true;

    this._taskServiceProxy
      .createTask(this.task)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
