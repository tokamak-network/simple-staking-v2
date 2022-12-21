import { Flex, useTheme } from "@chakra-ui/react";
import { FC } from 'react';

type PageHeadProps = {
  title: string;
  subtitle: string
}

export const PageHeader: FC<PageHeadProps> = ({
  title,
  subtitle
}) => {
  const theme = useTheme();
  return (
    <Flex w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
      <Flex {...theme.PAGE_STYLE.layoutHeader()}>
        {title}
      </Flex>
      <Flex {...theme.PAGE_STYLE.layoutHeaderSub()}>
        {subtitle}
      </Flex>
    </Flex>
  );
}

export default PageHeader;