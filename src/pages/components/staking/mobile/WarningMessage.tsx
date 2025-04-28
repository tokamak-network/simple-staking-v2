import { ETHERSCAN_LINK } from "@/constants";
import { Flex, Text, Link } from "@chakra-ui/react"

type WarningMessageProps = {
  
  title: string
  minimumAmount: boolean
  selectedOp: any;
  account: any;
}

export function WarningMessage (args: WarningMessageProps) {
  const {title, minimumAmount, account, selectedOp} = args
  return (
    <Flex>
      {
          title === 'Stake' && !minimumAmount && account ?
          <Text
            fontSize={'12px'}
            color={'#ff2d78'}
            flexDir={'row'}
            mt={'15px'}
            textAlign={'center'}
          >
            <Link
              mr={'3px'}
              href={'#'}
              color="#ff2d78"
              textDecor={'none'}
            >
              Warning: The
            </Link>
            <Link
              color={'#2a72e5'}
              mx={'3px'}
              href={`${ETHERSCAN_LINK}/address/${selectedOp.candidate}`}
              isExternal
            >
              operator
            </Link>
            is required to stake at least
            <Link
              isExternal
              href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
              color={'#2a72e5'}
              mx={'3px'}
            >
              1,000.1 TON
            </Link>
            on this layer2 before stakers can receive the staking reward. Users are unable to stake until this minimum collateral requirement is fulfilled.
          </Text>
          : title === 'Stake' && minimumAmount ?
          <Text
            fontSize={'12px'}
            color={'#3e495c'}
            flexDir={'row'}
            mt={'15px'}
            
          >
              Recommended minimum staking amount is 
              <span
                style={{
                  marginLeft: '3px',
                  color: '#2a72e5',
                  textDecoration: 'none'
                }}
              >
                5 TON
              </span>
            
          </Text>
          : title === 'Restake' ? 
          <Text
            fontSize={'12px'}
            color={'#3e495c'}
            flexDir={'row'}
            mt={'15px'}
            textAlign={'center'}
          >
            <Link
              mr={'3px'}
              href={'#'}
              color="#ff2d78"
              textDecor={'none'}
            >
              Warning
            </Link>
            : Restaking will stake unstaked TON, and these cannot be withdrawn until they are unstaked again.
          </Text>
          : title === 'Unstake' ?
          <Text
          fontSize={'12px'}
          color={'#3e495c'}
          flexDir={'row'}
          mt={'15px'}
          textAlign={'center'}
        >
          <Link
            mr={'3px'}
            href={'#'}
            color="#ff2d78"
            textDecor={'none'}
          >
            Warning
          </Link>
          : You can withdraw (W)TON to your wallet after 93,046 blocks (~14 days) from unstaking. Remember to claim any unclaimed staking reward before unstaking.
        </Text>
          : ''
        }
    </Flex>
  )
}

export default WarningMessage