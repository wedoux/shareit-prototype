import { HashRouter, Route, Routes } from 'react-router-dom'
import { DemoControlsPanel } from './components/DemoControlsPanel'
import { DemoControlsProvider } from './state/DemoControlsContext'
import { EntryScreen } from './screens/EntryScreen'
import { ResultsScreen } from './screens/ResultsScreen'

function App() {
  return (
    <DemoControlsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<EntryScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
        </Routes>
      </HashRouter>
      <DemoControlsPanel />
    </DemoControlsProvider>
  )
}

export default App
