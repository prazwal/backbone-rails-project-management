var app = app || {}



app.TaskListView = Backbone.View.extend({

  className:'task-list well list',

  initialize:function(){
      //this.model.on('add', this.reRender, this);
      this.model.get('tasks').on('add',this.reRender,this);
      this.model.get('tasks').on('reset',this.reRender2,this);
      this.model.get('tasks').on('remove',this.reRender,this);
      this.model.get('tasks').on('change',this.reRender,this);
     //this.model('add', this.reRender, this);
  },

  reRender:function(e){
        //console.log("RERENDER PROJECT");
    this.render();

    // if(app.norerender >= 2) {
    //   return;
    // }
    //app.norerender += 1;

            //var project = app.projects.get(app.projectId);
           //var projectView = new app.ProjectView({ model: project });
           //projectView.render();
    },


    reRender2:function(e){
          //console.log("reset tasklist");
      this.render();
    },

  events:{
      'submit form.add-task':'addTask',
      'click  .del-task': 'deleteTask',
      'click  .dropzone': 'openTask',
      'hover form.add-task':'showAddTask'
  },

  showAddTask:function(){
    debugger;
  },

  openTask:function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();

    taskId_str =$(event.currentTarget).attr('id').replace( /[^\d.]/g, '' );
    taskId = parseInt(taskId_str);
    console.log(taskId);
    var $taskModal = $('div.task-modal');

    var tasklist = this.model;
    var tasks = tasklist.get('tasks');
    var task = tasks.get(taskId);

    var taskTitle = task.get('title');
    console.log(task);
    task.fetch().done(function(){
    console.log(task);
      var taskModalView = new app.TaskModalView({
        model: task
      });
      var modal = new Backbone.BootstrapModal({
        content: taskModalView,
        allowCancel: false,
        title: taskTitle,
        okText: 'close',
        animate: true
      }).open(function(){ console.log('clicked OK') });

    });


  },


  addTask:function(event){

      event.preventDefault();
      taskOwnerId = app.current_user;
      tasklist_id = this.model.get('id');
      var tasklist = this.model;
      var taskTitle = this.$el.find("#add-task").val();

      var tasks = tasklist.get('tasks');
      var task = new app.Task();
      if(taskTitle !== ""){
        task.set({
          title:taskTitle,
          description:"NO DISCRIPTION YET",
          due_date: "NOT NOW",
          color:"NOT NOW",
          position:999,
          task_list_id:tasklist_id ,
          task_owner_id:taskOwnerId,
          alias: app.user_alias
        });
      task.save().done(function () {
         tasks.add(task);
       });
    }
  },

  deleteTask:function(event){
    event.stopPropagation();
    taskId_str = $(event.target).attr('id').replace ( /[^\d.]/g, '' );
    taskId = parseInt(taskId_str);
    tasklist = this.model;
    var tasks = tasklist.get('tasks');
    var task = tasks.get(taskId);

    task.destroy({
      success:function(data){
        tasks.remove(task)
      }
    });

  },


  render:function(){
    var self = this;

    var taskList = this.model;
    //var tasks = new app.Tasks( taskList.get('tasks') );
    var taskcollection = taskList.get('tasks');


    var taskListId = taskList.get('id');


    var taskListPosition =  taskList.get('position');
    this.$el.attr('position', taskListPosition);





    var id = "list-"+taskListId;
    this.$el.attr('id', id);
    var individialListTemplate = _.template($('#individual-list').html());
    var html = individialListTemplate({taskList: this.model});
    this.$el.html(html);
    //this.$el.appendTo('.list');

    taskcollection.comparator = function(taskcollection){
        return taskcollection.get('position');
      }
      //console.log(taskcollection.toJSON());
      var taskView = new app.TaskView({
        collection:taskcollection
      });
      //self.$('.task').html(taskView.render().children('div'));
      self.$('.task').html(taskView.render());




    var $tasks = this.$('.task');
    $tasks.sortable({
      items: 'div.well',
      connectWith: '.task',
      delay: 200,
      tolerance: 'pointer',
      placeholder:'task-placeholder',


      update: function (event, ui) {
         var taskSortData = $(this).sortable('serialize');
         listId_str = $(event.target).parent().attr('id').replace ( /[^\d.]/g, '' );
         listId = parseInt(listId_str);
         taskSortData += '&list_id=' + listId;
          //console.log(taskSortData);
          //ajax for now,   try to use backbone while refactoring......................................(!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
          if(taskSortData){
          $.post('tasks/sort', taskSortData, function (sortedTasks) {
            //console.log(sortedTasks);

            var tasks = taskList.get('tasks');

            tasks.reset(sortedTasks.tasks);
          });
        }
      },

    });

    //this.$el.unwrap();
    //this.$el.html('.my-tasklists');
    return this.$el;
  }
});
