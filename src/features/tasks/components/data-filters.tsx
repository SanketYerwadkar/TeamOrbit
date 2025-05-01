import { Folder, ListChecks, UserIcon } from 'lucide-react';

import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] = useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === 'all' ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === 'all' ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === 'all' ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      {/* Status Filter */}
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="h-8 w-full lg:w-auto bg-white flex items-center pr-2">
          <ListChecks className="mr-2 size-4" />
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem className="bg-green-300 hover:bg-green-300 data-[state=checked]:bg-green-300" value="all">
            All statuses
          </SelectItem>
          <SelectSeparator />
          <SelectItem className="bg-red-300 hover:bg-red-300 data-[state=checked]:bg-red-300" value={TaskStatus.BACKLOG}>
            Backlog
          </SelectItem>
          <SelectItem className="bg-yellow-300 hover:bg-yellow-300 data-[state=checked]:bg-yellow-300" value={TaskStatus.IN_PROGRESS}>
            In Progress
          </SelectItem>
          <SelectItem className="bg-blue-300 hover:bg-blue-300 data-[state=checked]:bg-blue-300" value={TaskStatus.IN_REVIEW}>
            In Review
          </SelectItem>
          <SelectItem className="bg-emerald-300 hover:bg-emerald-300 data-[state=checked]:bg-emerald-300" value={TaskStatus.TODO}>
            Todo
          </SelectItem>
          <SelectItem className="bg-pink-300 hover:bg-pink-300 data-[state=checked]:bg-pink-300" value={TaskStatus.DONE}>
            Done
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Assignee Filter */}
      <Select defaultValue={assigneeId ?? undefined} onValueChange={onAssigneeChange}>
        <SelectTrigger className="h-8 w-full lg:w-auto bg-white flex items-center pr-2">
          <UserIcon className="mr-2 size-4" />
          <SelectValue placeholder="All assignees" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem className="bg-blue-300" key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Project Filter (only if not hidden) */}
      {!hideProjectFilter && (
        <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
          <SelectTrigger className="h-8 w-full lg:w-auto bg-white flex items-center pr-2">
            <Folder className="mr-2 size-4" />
            <SelectValue placeholder="All projects" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem className="bg-blue-300" key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Due Date Picker */}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto text-black"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({
            dueDate: date ? date.toISOString() : null,
          });
        }}
        showReset
      />
    </div>
  );
};
