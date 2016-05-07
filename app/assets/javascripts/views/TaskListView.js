var app = app || {}

app.TaskListView = Backbone.View.extend({

  className:'task-list',


  initialize:function(){

     this.model.get('tasks').on('add',this.reRender,this);
  },

  reRender:function(){
      this.render();
  },


  events:{
      'submit form.add-task':'addTask'
  },

  addTask:function(e){
      event.preventDefault();
      taskOwnerId = app.current_user
      tasklist_id = this.model.get('id');
      var tasklist = this.model;
      var taskTitle = this.$el.find("#add-task").val();

      var tasks = tasklist.get('tasks');
      var task = new app.Task();
      console.log("tt",taskTitle);
      if(taskTitle !== ""){
        task.set({
          title:taskTitle,
          description:"NO DISCRIPTION YET",
          //due_date:
          //color:
          //position:
          task_list_id:tasklist_id ,
          task_owner_id:taskOwnerId
        });
      task.save(); // Saves it to the server - POST /secrets
      tasks.add( task );
    }
  },


  render:function(){
    var self = this;

    var taskList = this.model;
    //var tasks = new app.Tasks( taskList.get('tasks') );
    var taskcollection = taskList.get('tasks');

    var individialListTemplate = _.template($('#individual-list').html());
    var html = individialListTemplate({taskList: this.model});
    this.$el.html(html);
    this.$el.appendTo('.list');


    taskcollection.comparator = function(tasks){
        return taskcollection.get('position');
      }
       taskcollection.sort();
      taskcollection.each(function (task) {

        //debugger;
        var taskView = new app.TaskView({
          model: task
          });
        self.$('.task').append(taskView.render());
      });


    var $tasks = this.$('.task');
    $tasks.sortable({
      items: 'div.well',
      connectWith: '.task',
      delay: 200,
      tolerance: 'pointer',
      //placeholder: 'task-placeholder',

      start: function (event, ui) {
        // listId_str = $(event.target).parent().attr('id').replace ( /[^\d.]/g, '' );
        // listId = parseInt(listId_str);
        // console.log("DRAG FROM: ",listId);
        // console.log(ui.item.index());
      },

      update: function (event, ui) {

         var taskSortData = $(this).sortable('serialize');
         listId_str = $(event.target).parent().attr('id').replace ( /[^\d.]/g, '' );
         listId = parseInt(listId_str);
         taskSortData += '&list_id=' + listId;

          //console.log(taskSortData);
          //ajax for now,   try to use backbone while refactoring......................................(!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
          $.post('tasks/sort', taskSortData, function (resortedCards) {
            var tasks = tasklists.get('tasks');
            tasks.reset(resortedTaskss.tasks);
          });
      },

      receive: function(event, ui){

      //   listId_str = $(event.target).parent().attr('id').replace ( /[^\d.]/g, '' );
      //   listId = parseInt(listId_str);
      //   console.log("DROP TO: ",listId);
      //   console.log(ui.item.index());
      //   var itemChildId = ui.item.children().first().attr('id');
      // //  console.log(itemChildId);
      //
      //  //tasks where

      }
    });


    return this.$el;
  }
});
