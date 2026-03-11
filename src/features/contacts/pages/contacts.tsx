import PageLayout from '@/components/layout/page-layout'
import { useMatch, useParams } from 'react-router'
import ContactsList from '../components/contacts-list'

const Contacts = () => {
  const { contactId } = useParams<{ contactId: string }>()
  const isRequestsRoute = useMatch("/contacts/requests")
  return (
    <PageLayout
      list={<ContactsList />}
      showDetail={!!contactId || !!isRequestsRoute}
    />
  )
}

export default Contacts