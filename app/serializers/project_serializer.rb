class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title , :description , :organisation, :project_owner_id

  has_many :task_lists, embed: :objects

end
