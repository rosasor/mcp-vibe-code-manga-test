import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mt="auto"
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <ListHeader>MangaList</ListHeader>
            <Link as={RouterLink} to={'/'}>Home</Link>
            <Link as={RouterLink} to={'/about'}>About</Link>
            <Link as={RouterLink} to={'/contact'}>Contact</Link>
            <Link as={RouterLink} to={'/terms'}>Terms of Service</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Discover</ListHeader>
            <Link as={RouterLink} to={'/browse'}>Browse All</Link>
            <Link as={RouterLink} to={'/browse?sort=popular'}>Popular</Link>
            <Link as={RouterLink} to={'/browse?sort=newest'}>New Releases</Link>
            <Link as={RouterLink} to={'/browse?tags=Recommended'}>Recommended</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Account</ListHeader>
            <Link as={RouterLink} to={'/login'}>Login</Link>
            <Link as={RouterLink} to={'/register'}>Sign Up</Link>
            <Link as={RouterLink} to={'/profile'}>Profile</Link>
            <Link as={RouterLink} to={'/library'}>My Library</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Follow Us</ListHeader>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}>
          <Text>© 2025 MangaList. All rights reserved</Text>
        </Container>
      </Box>
    </Box>
  );
} 