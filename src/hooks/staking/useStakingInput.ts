import {
  stake_restakeModal_inputState,
  stake_restakeModal_state,
  stake_stakeModal_input,
  stake_stakeModal_state,
  stake_unstakeModal_input,
  stake_unstakeModal_state,
  stake_withdrawModal_inputState,
  stake_withdrawModal_state,
} from "atom/staking/input";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { InputKey } from "types/atom";

function useStakeInput(key: InputKey): {
  inputValue: any;
  value: any;
  setValue: any;
  resetValue: any;
} {
  const stakeModal_inputValues = useRecoilValue(stake_stakeModal_state);
  const [stakeModalValue, setStakeModalValue] = useRecoilState(
    stake_stakeModal_input
  );
  const resetStakeModalValue = useResetRecoilState(stake_stakeModal_input);

  const withdrawModal_inputValues = useRecoilValue(stake_withdrawModal_state);
  const [withdrawModalValue, setwithdrawModalValue] = useRecoilState(
    stake_withdrawModal_inputState
  );
  const resetwithdrawModalValue = useResetRecoilState(
    stake_withdrawModal_inputState
  );

  const unstakeModal_inputValues = useRecoilValue(stake_unstakeModal_state);
  const [unstakeModalValue, setUnstakeModalValue] = useRecoilState(
    stake_unstakeModal_input
  );
  const resetUnstakeModalValue = useResetRecoilState(stake_unstakeModal_input);

  const restakeModal_inputValues = useRecoilValue(stake_restakeModal_state);
  const [restakeModalValue, setrestakeModalValue] = useRecoilState(
    stake_restakeModal_inputState
  );
  const resetrestakeModalValue = useResetRecoilState(
    stake_restakeModal_inputState
  );

  switch (key) {
    case "stake_modal":
      return {
        inputValue: stakeModal_inputValues,
        value: stakeModalValue,
        setValue: setStakeModalValue,
        resetValue: resetStakeModalValue,
      };
    case "withdraw_modal":
      return {
        inputValue: withdrawModal_inputValues,
        value: withdrawModalValue,
        setValue: setwithdrawModalValue,
        resetValue: resetwithdrawModalValue,
      };
    case "unstake_modal":
      return {
        inputValue: unstakeModal_inputValues,
        value: unstakeModalValue,
        setValue: setUnstakeModalValue,
        resetValue: resetUnstakeModalValue,
      };
    case "restake_modal":
      return {
        inputValue: restakeModal_inputValues,
        value: restakeModalValue,
        setValue: setrestakeModalValue,
        resetValue: resetrestakeModalValue,
      };
    default:
      return {
        inputValue: undefined,
        value: undefined,
        setValue: undefined,
        resetValue: undefined,
      };
  }
}

export default useStakeInput;
