import { createFileRoute } from '@tanstack/react-router'
import App from '../components/App'
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'

export const Route = createFileRoute('/')({
  component: Index,
})



function Index() {
  return (
    <div className="p-2">
        <Authenticator>
            <App/>
        </Authenticator>
    </div>
  )
}