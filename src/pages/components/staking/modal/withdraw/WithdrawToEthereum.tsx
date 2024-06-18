import { Text, Button, Checkbox, Flex, FormControl, FormLabel, Menu, MenuButton, Select, Switch, useTheme, MenuList } from "@chakra-ui/react"
import {useEffect, useState} from 'react';
import Image from "next/image";
import arrow from "@/assets/images/select-1-arrow-inactive.svg";

type WithdrawToEthereumProps ={

}

export const WithdrawToEthereum = (args: WithdrawToEthereumProps) => {
  const {} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const [toggle, setToggle] = useState('Withdraw')
  const [option, setOption] = useState('WTON')
  const [menuState, setMenuState] = useState(false);
  useEffect(() => {
    setMenuState(false);
  }, [])
  const options = ['WTON', 'TON']

  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
      <Flex
       flexDir={'row'} 
       justifyContent={'space-between'}
       alignItems={'center'}
       w={'320px'}
       mb={'12px'}
      >
        <Flex
          fontSize={'14px'}
          fontWeight={500}
          color={'#3e495c'}
          // w={'110px'}
        >
          Withdraw history
        </Flex>
        <FormControl
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          w={'100px'}
        >
          <FormLabel
            fontSize={'11px'}
            fontWeight={'normal'}
            color={'#828d99'}
            mt={'5px'}
          >
            Restake
          </FormLabel>
          <Switch 
            colorScheme='green' 
            onChange={() =>
              toggle === 'Withdraw'
                ? setToggle('Restake')
                : setToggle('Withdraw')
            }
          />
        </FormControl>
      </Flex>
      <Flex>
        Table
      </Flex>
      <Flex my={'21px'} h={'75px'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
        <Flex
          fontSize={'12px'}
          fontWeight={500}
          color={'#808992'}
          mb={'5px'}
        >
          Total amount of {
            toggle === 'Withdraw' ?
            <Flex color={'#2a72e5'} mx={'3px'}>
              Withdaw
            </Flex> :
            <Flex color={'#36af47'} mx={'3px'}>
              Restake
            </Flex>
          } available
        </Flex>
        <Flex 
          fontSize={'18px'}
          fontWeight={500}
          color={'#3d495d'}
        >
          <Flex mr={'9px'}>
            20,000.00
          </Flex>
          {
            toggle === 'Restake' ?
            <Flex>
              TON
            </Flex> :
            <Menu>
              <MenuButton
                w={'62px'}
                px={'6px'}
                mx={0}
                h={'24px'}
                color={'#3e495c'}
                fontSize={'12px'}
                bgColor={'#fff'}
                boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.14)'}
                borderRadius={'4px'}
                border={'solid 1px #dfe4ee'}
                placeholder="WTON"
              // onChange={onChangeSelectBox}
              >
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text>{option}</Text>
                  <Flex
                    marginLeft={"4px"}
                    height={"24px"}
                    transform={menuState === true ? "rotate(180deg)" : ""}
                  >
                    <Image src={arrow} alt="icon_arrow" />
                  </Flex>
                </Flex>
              </MenuButton>
              <MenuList
                onClick={() => setMenuState(false)}
                color={'#3e495c'}
                bgColor={'#fff'}
                maxW={'62px'}
                width={'62px'}
                boxShadow={'0 2px 4px 0 rgba(96, 97, 112, 0.14)'}
                fontSize={'12px'}
                p={'7px 0px 7px 10px'}
                
              >
                {options.map((option: any) => {
                  return (
                    <Flex
                      mb={'6px'}
                      mt={'4px'}
                      // maxW={'62px'}
                      cursor={'pointer'}
                      onClick={() => setOption(option)}
                    >
                      {option}
                    </Flex>
                  )
                })}
              </MenuList>
            </Menu>
          }
        </Flex>
      </Flex>
      <Flex w={'100%'} h={'1px'}  bgColor={'#f4f6f8'} />
      <Flex flexDir={'column'} alignItems={'center'}>
        {
          toggle === 'Restake' ?
          <Flex mt={'25px'}>
            <Checkbox />
            <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={'271px'}>
              Donec quam lectus vel vulputate mauris. Nullam quam amet adipiscing quis diam nisl maecenas. Ornare fermentum ullamcorper ut ullamcorper amet. Amet et ut posuere.
            </Flex>
          </Flex> : ''

        }
      <Button
        {...btnStyle.btnAble()}
        w={'130px'}
        h={'38px'}
        mt={'25px'}
        fontSize={'14px'}
        fontWeight={500}
        bgColor={toggle === 'Restake' ? '#36af47' : ''}
      >
        {toggle}
      </Button>
      </Flex>
    </Flex>
  )
}