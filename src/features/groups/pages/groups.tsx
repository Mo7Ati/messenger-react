import PageLayout from '@/components/layout/page-layout'
import { GroupsList } from '../components/groups-list';
import { useParams } from 'react-router';

const Groups = () => {
  const { chatId } = useParams<{ chatId: string }>()

  return (
    <PageLayout
      list={<GroupsList />}
      showDetail={!!chatId}
    />
  )
};

export default Groups;