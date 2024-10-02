import { getEvent } from "@/api";
import { useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { GET_CHANGED_MEMBER } from "@/graphql/getCandidates";

export function useChangedMembers() {
  const [memberAddresses, setMemberAddresses] = useState<any[]>();
  const { data } = useQuery(GET_CHANGED_MEMBER, {
    pollInterval: 10000
  });

  useEffect(() => {
    async function fetchEvent () {
      let membersAddress: any[] = []
      const events = await getEvent('ChangedSlotMaximum')
      const checkSlot = events.filter((event: any) => event.eventName === 'ChangedSlotMaximum')
      const slotNumber = checkSlot[0] ? checkSlot[0].data.slotMax : 3

      if (data) {
        const { changedMembers } = data
        
        for (let i = 0; i < slotNumber; i ++ ) {
          const slotOccupied = changedMembers.filter((changedMember: any) => Number(changedMember.slotIndex) === i)
          membersAddress.push({
            member: slotOccupied[0].newMember,
            elected: slotOccupied[0].timestamp,
            slot: slotOccupied[0].slotIndex
          })
        }
      }

      setMemberAddresses(membersAddress)
    }
    fetchEvent()
  }, [data])

  return { memberAddresses };
}