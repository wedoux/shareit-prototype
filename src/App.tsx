import { HashRouter, Route, Routes } from 'react-router-dom'
import { DemoControlsPanel } from './components/DemoControlsPanel'
import { DemoControlsProvider } from './state/DemoControlsContext'
import { ListerProvider } from './state/ListerContext'
import { EntryScreen } from './screens/EntryScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { ListingDetailScreen } from './screens/ListingDetailScreen'
import { WallScreen } from './screens/WallScreen'
import { RevealedScreen } from './screens/RevealedScreen'
import { PostRoomScreen } from './screens/PostRoomScreen'
import { LiveExpiryScreen } from './screens/LiveExpiryScreen'

function App() {
  return (
    <DemoControlsProvider>
      <ListerProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<EntryScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/listing/:id" element={<ListingDetailScreen />} />
            <Route path="/wall/:id" element={<WallScreen />} />
            <Route path="/revealed/:id" element={<RevealedScreen />} />
            <Route path="/post" element={<PostRoomScreen />} />
            <Route path="/live/:id" element={<LiveExpiryScreen />} />
          </Routes>
        </HashRouter>
        <DemoControlsPanel />
      </ListerProvider>
    </DemoControlsProvider>
  )
}

export default App
