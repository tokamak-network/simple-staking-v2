import { modalState } from '@/atom/global/modal';
import { useRecoilState } from 'recoil';

function useModal(modalType?: string) {
  const [selectedModal, setSelectedModal] = useRecoilState(modalState);

  const openModal = () => {
    if (modalType) setSelectedModal(modalType);
  };

  const closeModal = () => {
    setSelectedModal('');
  };

  return { openModal, closeModal };
}

export default useModal;
