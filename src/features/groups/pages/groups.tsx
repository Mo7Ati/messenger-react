import PageLayout from '@/components/layout/page-layout'
import { GroupsList } from '../components/groups-list';
import { useParams } from 'react-router';

const Groups = () => {
  const { groupId } = useParams<{ groupId: string }>()

  return (
    <PageLayout
      list={<GroupsList />}
      showDetail={!!groupId}
    />
  )
};

export default Groups;