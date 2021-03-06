class TaskListsController < ApplicationController

  def index
    # @projects = current_user.projects
    lists = TaskList.all
    render json: lists, status: :ok
  end

  def new
  end

  def create
      list = TaskList.new(task_list_params)
      if list.save
        render json: list, status: :ok   , root: false
      else
        render nothing: true, status: :unprocessable_entity
      end
  end

  def sort
    project = Project.find(params[:project_id]);

    task_list_id_arr = params[:list].map(&:to_i)
    pos = 1
    task_list_id_arr.each do |task_list_id|
        TaskList.find(task_list_id)
                .update_attributes(position: pos)
        pos = pos +1
    end
    lists = project.task_lists.where(id: task_list_id_arr)
    render json: lists

  end

  def destroy
    list = TaskList.find(params[:id])
    if list.destroy
      render json: list, status: :ok
   else
     render nothing: true, status: :unprocessable_entity
   end
end

  private

  def task_list_params

    params.require(:task_list)
          .permit(:title, :project_id,:tasks , :position)

  end



end
