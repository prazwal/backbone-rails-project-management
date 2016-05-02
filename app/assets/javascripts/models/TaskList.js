var app = app || {}

app.TaskList = Backbone.RelationalModel.extend({
  urlroot: '/tasklists',
  //idAttributes: "id"
  relations:[{
    type: Backbone.HasMany,
    key: 'tasks',
    relatedModel: 'app.Task',
    collectionType: 'app.Tasks',
    reverseRelation:{
      key: 'task_list',
      type: Backbone.BelongsTo
    }
  }]
});
