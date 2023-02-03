import { extendTheme } from '@chakra-ui/react';
import '@fontsource/titillium-web';
import '@fontsource/roboto';

interface THEME_PROPS {
  colorMode: 'light' | 'dark';
}

const fonts = {
  TitilliumWeb: 'Titillium Web, sans-serif',
  Roboto: 'Roboto',
  Nanum: `'NanumSquareEB', sans-serif`,
}

const breakpoints = ['0px', '1024px', '1440px'];

const colors = {
  blue: {
    100: '#257eee',
    200: '#2a72e5',
  },
  white: {
    100: '#ffffff',
    200: '#f1f1f1',
    300: '#fafbfc',
  },
  gray: {
    100: '#808992',
    200: '#e9edf1',
    300: '#86929d',
    400: '#dfe4ee',
    500: '#84919e',
    600: '#c7d1d8',
    700: '#3e495c',
    800: '#e7ebf2',
    900: '#7f8993',
    1000: '#818992',
    1100: '#646d7c'
  },
  black: {
    100: "#3d495d",
    200: "#121318",
    300: '#131315'
  },
  red: {
    100: '#e23738',
  },
  green: {
    100: '#5eea8d',
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
  }),
}

const SUPPORT_PARAGRAPH_STYLE = {
  paragraphText:() => ({
    fontFamily: fonts.Roboto,
    fontSize: '17px',
    color: '#3d495d',
    fontWeight: 'normal',
    marginBottom: '20px',
    textAlign: 'justify',
  })
  
}

const INPUT_STYLE = {
  inputStaking: () => ({
    fontSize:'32px',
    height:'100%',
    borderRadius: 0,
    textAlign:'center',
    overflow:'auto',
    fontWeight:600,
    _placeholder:{ color: '#304156' },
    border: '',
    ml:'15px',
  }),
  inputCalc: () => ({
    fontSize:'13px',
    fontWeight: 'normal',
    height: '28px',
    border: 'none',
    textAlign: 'right',
    color: '#3e495c',
    _placeholder:{ color: '#86929d' },
    padding: '0px',
    width: '70px',
    marginLeft: '5px',
    marginTop: '1px',
  }),
  maxStaking: () => ({
    // pos: 'absolute',
    // right:'-60px',
    w:'50px',
    h:'26px',
    mt:'10px',
    bg:'none',
    fontSize:'12px',
    color:'#2a72e5',
    fontWeight:'normal',
    cursor:'pointer',
    border: '1px solid #2a72e5',
    _hover:{
      border: '1px solid #2a72e5',
    },
  }),
  maxCalc: () => ({
    h: '32px',
    w: '56px',
    ml: '5px',
    border: '1px solid #dfe4ee',
    _hover:{
      border: '1px solid #dfe4ee',
    },
    bg:'none',
    fontSize: '12px',
    fontWeight: 'normal',
    color: '#86929d',
  })
}


const STAKING_HISTORY_TABLE_STYLE = {
  tableRow: () => ({
    m: 0,
    pr: 0,
    display: 'flex',
    alignItems: 'center',
    h: '38px',
    fontSize: '13px',
    borderBottom: '1px dashed #e6eaee',
  }),
  paginationTable: () => ({
    w: '100%',
    h: '50px',
    pt: '5px',
    pr: 9,
    border: '',
    mb: '25px',
    borderTopWidth: 0,
    borderBottomRadius: '10px',
  }),
  paginationButton: () => ({
    width: '24px',
    height: '24px',
    border: 'solid 1px #e6eaee',
    color: '#e6eaee',
    bg: 'white.100',
    borderRadius: 4,
    size: 'sm',
    _hover: { borderColor: '#2a72e5', color: '#2a72e5' },
  })
}

const btnStyle = {
  btnAble: () => ({
    bg: 'blue.100',
    color: 'white.100',
    _hover: { backgroundColor: 'blue.200' },
    fontWeight: 500,
  }),
  btnDisable: () => ({
    bg: colors.gray[300],
    color: 'gray.200',
    // color: colors.gray[200],
    fontWeight: 500,
    // borderWidth: p0 : 1,
    borderColor: '',
    _hover: {},
  }),
  btnWalletPeriodSelected: () => ({
    width: '100px',
    height: '25px',
    // margin: 4px 10px 24px 50px;
    padding: '4px 35px 5px',
    borderRadius: '4px',
    border: 'solid 1px #2a72e5',
    backgroundColor: '#fff',
    fontSize: '12px',
    fontWeight: 500,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#2a72e5',
  }),
  btnWalletPeriod: () => ({
    width: '100px',
    height: '25px',
    // margin: 4px 10px 24px 50px;
    padding: '4px 35px 5px',
    borderRadius: '4px',
    border: 'solid 1px #dfe4ee',
    backgroundColor: '#fff',
    fontSize: '12px',
    fontWeight: 500,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#86929d',
  })
  ,
  btnWalletSearch: () => ({
    width: '100px',
    height: '32px',
    // margin: 4px 10px 24px 50px;
    padding: '4px 35px 5px',
    borderRadius: '4px',
    border: 'solid 1px #dfe4ee',
    backgroundColor: '#257eee',
    fontSize: '14px',
    fontWeight: 500,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#fff',
  })
};

const theme = extendTheme({
  colors,
  fonts,
  PAGE_STYLE,
  STAKING_HISTORY_TABLE_STYLE,
  SUPPORT_PARAGRAPH_STYLE,
  btnStyle,
  INPUT_STYLE,
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
        // props.colorMode === 'light' ? 'white.100' : 'black.100',
        // fontFamily: fonts.Poppins,
        color: '#3d495d',
      },
      button: {
        backgroundColor: 'black.100',
      },
    }),
  },
})

export default theme
