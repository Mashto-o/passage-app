function App() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-md p-lg">
      <h1 className="text-display-xl text-neutral-900">Passage</h1>
      <p className="text-body-md text-neutral-500">Onest font, body-md token</p>
      <div className="bg-primary-500 text-neutral-0 p-md rounded-lg text-body-sm">
        Primary button style
      </div>
      <div className="bg-danger-100 text-danger-700 p-sm rounded-xs text-caption-md">
        Danger state
      </div>
    </div>
  )
}

export default App