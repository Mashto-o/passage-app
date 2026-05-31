import { ArrowRight } from 'lucide-react'
import { Button } from './components'

function App() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-start justify-center py-xl">
      <div className="max-w-sm w-full mx-auto px-lg py-xl bg-neutral-0 flex flex-col gap-sm rounded-lg">

        <p className="text-caption-sm text-neutral-500">primary</p>
        <Button variant="primary" label="Primary button" fullWidth />

        <p className="text-caption-sm text-neutral-500">secondary</p>
        <Button variant="secondary" label="Secondary button" fullWidth />

        <p className="text-caption-sm text-neutral-500">ghost</p>
        <Button variant="ghost" label="Ghost button" fullWidth />

        <p className="text-caption-sm text-neutral-500">link</p>
        <Button variant="link" label="Link button" fullWidth />

        <p className="text-caption-sm text-neutral-500">destructive</p>
        <Button variant="destructive" label="Destructive button" fullWidth />

        <p className="text-caption-sm text-neutral-500">primary · icon right</p>
        <Button
          variant="primary"
          label="Continue"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          fullWidth
        />

        <p className="text-caption-sm text-neutral-500">disabled</p>
        <Button variant="primary" label="Primary button" fullWidth disabled />

      </div>
    </div>
  )
}

export default App
