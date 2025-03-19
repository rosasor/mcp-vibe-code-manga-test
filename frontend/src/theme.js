import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5f0ff',
      100: '#e9deff',
      200: '#d4bdff',
      300: '#b693ff',
      400: '#9c6eff',
      500: '#8344ff',
      600: '#7a28ff',
      700: '#6d1df2',
      800: '#5a16cc',
      900: '#4a13a8',
    },
    accent: {
      50: '#ffe5f8',
      100: '#ffb8e7',
      200: '#ff8ad5',
      300: '#ff5cc3',
      400: '#ff2eb2',
      500: '#ff0099',
      600: '#e6007a',
      700: '#cc005c',
      800: '#b3003e',
      900: '#99001f',
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Open Sans", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        p: '4',
        borderRadius: 'lg',
        boxShadow: 'md',
        bg: 'white',
      },
    },
  },
});

export default theme; 