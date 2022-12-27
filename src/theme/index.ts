import { extendTheme } from '@chakra-ui/react'
import '@fontsource/titillium-web'
import '@fontsource/roboto'

interface THEME_PROPS {
  colorMode: 'light' | 'dark',
}

const fonts = {
  TitilliumWeb: "TitilliumWeb",
  Roboto: "Roboto",
  Nanum: `'NanumSquareEB', sans-serif`
}

const breakpoints = ['0px', '1024px', '1440px'];

const colors = {
  blue: {
    100: "#257eee",
    200: "#2a72e5",
  },
  white: {
    100: "#ffffff",
    200: "#f1f1f1",
    300: "#fafbfc",
  },
  gray: {
    100: "#808992",
  },
  black: {
    100: "#3d495d",
    200: "#121318",
  },
  red: {
    100: "#e23738",
  },
  green: {
    100: "#5eea8d",
  },
}

const PAGE_STYLE = {
  layoutTheme: () => ({
    width: '1114px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 1px 0 rgba(96, 97, 112, 0.16)',
    borderRadius: '10px',
  }),
  layoutHeader: () => ({
    // width: '118px',
    height: '42px',
    fontFamily: fonts.Nanum,
    fontSize: '38px',
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.58,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#3d495d',
  }),
  layoutHeaderSub: () => ({
    height: '24px',
    fontFamily: fonts.TitilliumWeb,
    fontSize: '16px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 3.75,
    letterSpacing: '0.4px',
    textAlign: 'center',
    color: '#808992',
    mt: '15px',
    mb: '60px',
  })
}

const STAKING_HISTORY_TABLE_STYLE = {
  tableRow: () => ({
    m: 0,
    pr: 0,
    display: "flex",
    alignItems: "center",
    h: '38px',
    fontSize: '13px',
    borderBottom: '1px dashed #e6eaee',
  }),
  paginationTable: () => ({
    w: '100%',
    h: '50px',
    pt: '5px',
    pr: 9,
    bg: 'white.100',
    border: '',
    mb: '25px',
    borderTopWidth: 0,
    borderBottomRadius: "10px"
  }),
  paginationButton: () => ({
    width: '24px',
    height: '24px',
    border: 'solid 1px #e6eaee',
    color: '#e6eaee',
    bg: 'white.100',
    borderRadius: 4,
    size: 'sm',
    _hover: {borderColor: '#2a72e5', color: '#2a72e5'},
  })
}

const theme = extendTheme({
  colors,
  fonts,
  PAGE_STYLE,
  STAKING_HISTORY_TABLE_STYLE,
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
        backgroundColor: '#fafbfc',
        // props.colorMode === "light" ? "white.100" : "black.100",
        // fontFamily: fonts.Poppins,
        color: props.colorMode === 'light' ? '#3d495d' : 'gray.100',
      },
      button: {
        backgroundColor: 'black.100',
      },
    }),
  },
})

export default theme
