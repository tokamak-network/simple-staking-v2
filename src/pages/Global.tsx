import { Global } from '@emotion/react'

const Fonts = () => (
  <Global 
    styles={`
      /* nanum */
      @font-face {
        font-family: 'NanumSquareEB',
        font-style: normal;
        font-weight: normal;
        src: url('https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@2.0/nanumsquare.css') format('woff');
      }
    `}
  />
)

export default Fonts