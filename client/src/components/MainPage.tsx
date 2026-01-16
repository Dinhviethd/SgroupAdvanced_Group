import { WorkspaceList } from './workspace/WorkspaceList'

export function MainPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <WorkspaceList />
    </div>
  )
}
