import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'
import { InteractiveGrid } from '../InteractiveGrid'

export default function Layout() {
  return (
    <div className="bg-black min-h-screen text-white">
      <InteractiveGrid />
      <Header />
      <div className="z-10 relative mx-auto px-4 py-6 container">
        <div className="gap-6 grid grid-cols-12">
          <aside className="hidden lg:block col-span-3">
            <Sidebar />
          </aside>

          <main className="col-span-12 lg:col-span-6">
            <Outlet />
          </main>

          <aside className="hidden xl:block col-span-3">
            <RightPanel />
          </aside>
        </div>
      </div>
    </div>
  )
}
