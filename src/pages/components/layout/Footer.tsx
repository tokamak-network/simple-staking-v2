import { Flex, Text, Image } from '@chakra-ui/react';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import MEDIUM_ICON from '@/assets/images/community/medium.png';
import TWITTER_ICON from '@/assets/images/community/twitter.png';
import GITHUB_ICON from '@/assets/images/community/github.png';
import TELEGRAM_ICON from '@/assets/images/community/telegram.png';
import DISCORD_ICON from '@/assets/images/community/discord.png';
import FACEBOOK_ICON from '@/assets/images/community/facebook.png';
// import INSTAGRAM_ICON from '@/assets/images/community/instagram.png';
import YOUTUBE_ICON from '@/assets/images/community/youtube.png';
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
    url: 'https://github.com/Onther-Tech/',
  },
  {
    icon: FACEBOOK_ICON,
    url: 'https://www.facebook.com/OntherInc/',
  },
  // {
  //   icon: INSTAGRAM_ICON,
  //   url: '',
  // },
  {
    icon: YOUTUBE_ICON,
    url: 'https://www.youtube.com/channel/UCF6vtIKF_0QQVRG983czVEQ/',
  },
  {
    icon: TWITTER_ICON,
    url: 'https://twitter.com/tokamak_network/',
  },
  {
    icon: LINKEDIN_ICON,
    url: 'https://www.linkedin.com/company/onther-tech/',
  },
  {
    icon: MEDIUM_ICON,
    url: 'https://medium.com/onther-tech/',
  },
];
function Footer() {
  const [width] = useWindowDimensions();
  const mobile = width < 1040;
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
          <Text color={'black.100'} fontWeight={'bold'} mr={'25px'}>
            TOKAMAK NETWORK PTE.LTD
          </Text>
          <Text mr={'25px'}>111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164</Text>
          <Flex>
            <Text>hello@tokamak.network</Text>
          </Flex>
        </Flex>

        <Flex h={'17px'} justifyContent={mobile ? 'center' : 'flex-end'}>
          {iconList.map((item, index) => {
            return (
              <Flex
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
              >
                <Image src={item.icon.src} alt={'icon'}></Image>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Footer;
