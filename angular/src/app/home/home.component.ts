import { Component, Injector, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  TaskServiceProxy,
  GetTasksOutput,
  GetActiveTaskCountOutput,
  TaskDto,
  UpdateTaskInput,
  TaskState
} from '@shared/service-proxies/service-proxies';
import { BehaviorSubject } from 'rxjs';
import { CreateTaskDialogComponent } from './tasks/create-task/create-task-dialog/create-task-dialog.component';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AppComponentBase
  implements OnInit {
  openTasks: TaskDto[] = [];
  openTaskCount: number;
  taskEmitter$ = new BehaviorSubject<number>(this.openTaskCount);

  constructor(
    injector: Injector,
    private _taskServiceProxy: TaskServiceProxy,
    private _modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this._taskServiceProxy
      .getActiveTaskCount().subscribe((result: GetActiveTaskCountOutput) => {
        this.openTaskCount = result.total;
        this.taskEmitter$.next(this.openTaskCount);
      });

    this._taskServiceProxy
      .getTasks(TaskState._1, 1).subscribe((result: GetTasksOutput) => {
        this.openTasks = result.tasks;
        this.cdr.detectChanges();
      });
  }

  createTask(): void {
    this._modalService.show(
      CreateTaskDialogComponent,
      {
        class: 'modal-lg',
      }
    );
  }

  UpdateTask(task: TaskDto): void {
    var data = new UpdateTaskInput();

    data.taskId = task.id;
    data.assignedPersonId = task.assignedPersonId;
    data.state = TaskState._2;

    this._taskServiceProxy
      .updateTask(data)
      .subscribe((result) => {
        // if (result) {
        abp.notify.success(this.l('SuccessfullyUpdated'));
      });

    //refresh table
  }
}
