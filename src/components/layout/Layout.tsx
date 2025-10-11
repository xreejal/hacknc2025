import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

export default function Layout() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="mx-auto px-4 py-6 container">
        <div className="gap-6 grid grid-cols-12">
          {/* Left Sidebar - Watchlist */}
          <aside className="hidden lg:block col-span-3">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-6">
            <Outlet />
          </main>

          {/* Right Panel - Trending/News */}
          <aside className="hidden xl:block col-span-3">
            <RightPanel />
          </aside>
        </div>
      </div>
    </div>
  )
}

