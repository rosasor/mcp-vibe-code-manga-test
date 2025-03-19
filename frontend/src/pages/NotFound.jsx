import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  VStack,
  Image,
  useColorModeValue
} from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading
            display="inline-block"
            as="h1"
            size="4xl"
            color={useColorModeValue('brand.500', 'brand.300')}
            fontSize="8xl"
          >
            404
          </Heading>
          <Heading as="h2" size="xl" mt={4} mb={8}>
            Page Not Found
          </Heading>
          <Text fontSize="xl" mb={8}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Image
            src="https://via.placeholder.com/400x300?text=Lost+in+Manga"
            alt="Lost in Manga"
            mx="auto"
            mb={8}
            borderRadius="lg"
            boxShadow="lg"
          />
          <Button
            as={RouterLink}
            to="/"
            colorScheme="brand"
            size="lg"
            fontWeight="bold"
            px={6}
          >
            Return to Home
          </Button>
        </Box>
      </VStack>
    </Container>
  );
} 