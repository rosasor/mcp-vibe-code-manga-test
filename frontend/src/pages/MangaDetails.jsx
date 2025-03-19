import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Badge,
  Flex,
  Button,
  useToast,
  Spinner,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import axios from 'axios';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/manga/${id}`);
        setManga(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load manga details.');
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load manga details.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchMangaDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading manga details...</Text>
      </Container>
    );
  }

  if (error || !manga) {
    return (
      <Container centerContent py={10}>
        <Heading as="h2" size="lg" color="red.500">
          {error || 'Manga not found'}
        </Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', md: 'minmax(200px, 300px) 1fr' }} gap={8}>
        <GridItem>
          <Image
            src={manga.image_url || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={manga.title}
            borderRadius="md"
            objectFit="cover"
            w="100%"
            h="auto"
            fallbackSrc="https://via.placeholder.com/300x450?text=No+Image"
          />
        </GridItem>
        <GridItem>
          <Stack spacing={4}>
            <Heading as="h1" size="2xl">
              {manga.title}
            </Heading>
            <Flex align="center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < Math.floor(manga.score / 2) ? 'yellow.400' : 'gray.300'}
                  boxSize={5}
                />
              ))}
              <Text ml={2} fontWeight="bold">
                {manga.score} / 10
              </Text>
            </Flex>
            <Flex flexWrap="wrap" gap={2}>
              {manga.genres?.map((genre) => (
                <Badge key={genre} colorScheme="teal" px={2} py={1} borderRadius="md">
                  {genre}
                </Badge>
              ))}
            </Flex>
            <Box>
              <Text fontWeight="bold">Status: {manga.status}</Text>
              <Text fontWeight="bold">Volumes: {manga.volumes || 'Unknown'}</Text>
              <Text fontWeight="bold">Chapters: {manga.chapters || 'Unknown'}</Text>
              <Text fontWeight="bold">Published: {manga.published || 'Unknown'}</Text>
            </Box>
            <Text>{manga.synopsis}</Text>
            <Flex gap={4} mt={4}>
              <Button colorScheme="blue">Add to Library</Button>
              <Button colorScheme="purple">Mark as Reading</Button>
            </Flex>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default MangaDetails; 