import { Flex, Text, Image, Link } from '@chakra-ui/react';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import MEDIUM_ICON from '@/assets/images/community/medium.png';
import TWITTER_ICON from '@/assets/images/community/TwitterX.svg';
import GITHUB_ICON from '@/assets/images/community/github.png';
import TELEGRAM_ICON from '@/assets/images/community/telegram.png';
import DISCORD_ICON from '@/assets/images/community/discord.png';
import LINKEDIN_ICON from '@/assets/images/community/linkedin.png';

const iconList = [
  {
    icon: TELEGRAM_ICON,
    url: 'https://t.me/tokamak_network/',
  },
  {
    icon: DISCORD_ICON,
    url: 'https://discord.gg/8wSpJKz',
  },
  {
    icon: GITHUB_ICON,
    url: 'https://github.com/tokamak-network/',
  },
  {
    icon: TWITTER_ICON,
    url: 'https://twitter.com/tokamak_network/',
  },
  {
    icon: LINKEDIN_ICON,
    url: 'https://sg.linkedin.com/company/tokamaknetwork/',
  },
  {
    icon: MEDIUM_ICON,
    url: 'https://medium.com/tokamak-network/',
  },
];

function Footer() {
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;
  return (
    <Flex w={'100%'} px={'50px'} flexDir="column" h={'76px'} justifyContent={'center'} mt={'50px'}>
      <Flex
        fontSize={12}
        color={'gray.700'}
        flexDir={mobile ? 'column-reverse' : 'row'}
        justifyContent={'space-between'}
        pb={'25px'}
        rowGap={mobile ? '15px' : 0}
      >
        <Flex h={'17px'} justifyContent={'space-between'}>
          <Text color={'#999999'} fontWeight={'bold'} mr={'25px'}>
          Copyright © 2024 <span style={{color: '#1c1c1c'}}>Tokamak Network</span> All Rights Reserved.
          </Text>
        </Flex>

        <Flex h={'17px'} justifyContent={mobile ? 'center' : 'flex-end'}>
          {iconList.map((item, index) => {
            return (
              <Link
                isExternal
                href={item.url}
                w={'20px'}
                h={'20px'}
                alignItems="center"
                justifyContent={'center'}
                borderRadius={10}
                _hover={{ backgroundColor: 'gray.900' }}
                key={`link-container-${index}`}
                mb={'10px'}
                mr={'15px'}
                cursor={'pointer'}
                zIndex={999}
              >
                <Image src={item.icon.src} alt={'icon'}/>
              </Link>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Footer;
