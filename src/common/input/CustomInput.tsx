import { InputGroup, useColorMode, NumberInput, NumberInputField, Button, Flex } from '@chakra-ui/react';
import { inputState } from '@/atom/global/input';
import React from 'react';
import { useRecoilState } from 'recoil';

type InputProp = {
  placeHolder?: string;
  w?: number | string;
  h?: number | string;
  // isDisabled?: boolean;
  value?: string | number;
  isError?: boolean;
  maxValue: any;
  // atomKey: string;
  
};

const addComma = (inputVal: any) => {
  const _val = inputVal;
  const checkInputVal = () => {
    if (_val) {
      const floatLen = _val.split('.')[1]?.length;
      if (floatLen) {
        return floatLen > 18 ? _val.slice(0, -1) : _val;
      }
      if (_val.split('.').length > 2) {
        return;
      }
      if (_val.split('.')[0]?.length > 1 && _val.split('.')[0]?.substring(0, 1) === '0') {
        return _val.split('.')[0].substring(1);
      }
      if (_val === '.') {
        return _val;
      } else {
        return _val.replace(/[^0-9a-zA-Z.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
    return '';
  };

  return checkInputVal();
};

function BalanceInput(props: InputProp) {
  const { placeHolder, h, isError, maxValue } = props;
  const { colorMode } = useColorMode();
  const [value, setValue] = useRecoilState(inputState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { value: inputValue } = target;
    setValue(addComma(inputValue));
  };

  return (
    <InputGroup w={'200px'}>
      <NumberInput
        isInvalid={isError}
        // w={'200px'}
        h={h || 45}
        fontSize={'32px'}
        color={colorMode === 'light' ? '#3D495D' : '#313442'}
        // _hover={{ borderColor: colorMode === "light" ? "blue.100" : "#535353" }}
        focusBorderColor={'#fff'}
        border={'none'}
        value={addComma(value)}
      >
        <Flex flexDir={'column'} alignItems={'center'}>
          <NumberInputField
            fontSize={'32px'}
            h={'100%'}
            // w={'10px'}
            borderRadius={0}
            // mr={'30px'}/
            textAlign={'center'}
            overflow={'auto'}
            fontWeight={600}
            placeholder={placeHolder}
            _placeholder={{ color: '#304156' }}
            onChange={onChange}
            border={{}}
            ml={'15px'}
          /> 
          <Flex 
            w={5} 
            h={2} 
            borderBottom={value==='' ? 'solid 2px #2a72e5' : ''}
            animation={'blink'}
          />
        </Flex>
        
      </NumberInput>
      <Button
        zIndex={100}
        pos="absolute"
        right={'-60px'}
        w={'50px'}
        h={'26px'}
        mt={'10px'}
        bg={'none'}
        fontSize={'12px'}
        color={'#2a72e5'}
        fontWeight={'normal'}
        cursor={'pointer'}
        border={
            '1px solid #2a72e5'
        }
        _hover={{
          border: '1px solid #2a72e5',
        }}
        onClick={() => {
          setValue(String(maxValue));
        }}>
        Max
      </Button>
    </InputGroup>
  );
}

export { BalanceInput };
