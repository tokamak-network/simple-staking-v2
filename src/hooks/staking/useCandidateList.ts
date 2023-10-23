import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

export function useCandidateList () {
  const [candidateList, setCandidateList] = useState([]);
  const { data } = useQuery(GET_CANDIDATE, {
    pollInterval: 10000
  });
  useEffect(() => {
    data ? setCandidateList(data) : ''
  }, [data, candidateList])

  return { candidateList }
}