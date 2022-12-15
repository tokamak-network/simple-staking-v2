import { extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins';

interface THEME_PROPS {
  colorMode: 'light' | 'dark';
}

const breakpoints = ['0px', '1024px', '1440px'];

const theme = extendTheme({
  // colors,
  // fonts,
  // BUTTON_STYLE,
  // HEADER_BUTTON_STYLE,
  // BALANCE_CONTAINER_STYLE,
  // PAGE_LAYOUT_STYLE,
  // TX_STATUS_CONTAINER_STYLE,
  initialColorMode: 'light',
  breakpoints,
  styles: {
    global: (props: THEME_PROPS) => ({
      'html, body': {
        backgroundColor: '#F9FAFB',
        // props.colorMode === "light" ? "white.100" : "black.100",
        // fontFamily: fonts.Poppins,
        color: props.colorMode === 'light' ? 'gray.100' : 'gray.100',
      },
      button: {
        backgroundColor: 'black.100',
      },
    }),
  },
});

export default theme;
