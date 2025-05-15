import { getModeData } from "@/atom/global/modal";
import { useRecoilState } from "recoil";

export default function useGetMode() {
  const [selectedMode, setSelectedMode] = useRecoilState(getModeData);

  return { selectedMode }
}