import { DemoControlsPanel } from './components/DemoControlsPanel'
import { DemoControlsProvider } from './state/DemoControlsContext'
import { ResultsScreen } from './screens/ResultsScreen'

function App() {
  return (
    <DemoControlsProvider>
      <ResultsScreen />
      <DemoControlsPanel />
    </DemoControlsProvider>
  )
}

export default App
