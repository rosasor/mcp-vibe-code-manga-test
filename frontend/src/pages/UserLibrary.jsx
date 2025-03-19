import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Badge,
  Flex,
  Stack,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MangaCard = ({ manga }) => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      shadow="md"
      transition="transform 0.3s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Link to={`/manga/${manga.id}`}>
        <Image 
          src={manga.image_url || 'https://via.placeholder.com/200x300?text=No+Image'} 
          alt={manga.title}
          height="250px"
          width="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/200x300?text=No+Image"
        />
        <Box p={3}>
          <Heading as="h3" size="sm" noOfLines={2} mb={2}>
            {manga.title}
          </Heading>
          <Flex justify="space-between" align="center">
            <Badge colorScheme={getStatusColor(manga.status)}>
              {manga.status}
            </Badge>
            <Text fontSize="sm" fontWeight="bold">
              {manga.score ? `${manga.score}/10` : 'N/A'}
            </Text>
          </Flex>
        </Box>
      </Link>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch(status) {
    case 'reading': return 'blue';
    case 'completed': return 'green';
    case 'on-hold': return 'yellow';
    case 'dropped': return 'red';
    case 'plan-to-read': return 'purple';
    default: return 'gray';
  }
};

const UserLibrary = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState({
    reading: [],
    completed: [],
    onHold: [],
    dropped: [],
    planToRead: []
  });
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('title');
  const toast = useToast();

  useEffect(() => {
    const fetchUserLibrary = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a real API call
        // const response = await axios.get(`http://localhost:8000/api/users/${user.id}/library`, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        
        // For now, let's create some dummy data
        const dummyData = {
          reading: [
            { 
              id: 1, 
              title: 'One Piece', 
              image_url: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
              status: 'reading',
              score: 9.2
            },
            { 
              id: 2, 
              title: 'Jujutsu Kaisen', 
              image_url: 'https://cdn.myanimelist.net/images/manga/3/210341.jpg',
              status: 'reading',
              score: 8.5
            },
            { 
              id: 3, 
              title: 'Chainsaw Man', 
              image_url: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
              status: 'reading',
              score: 8.7
            }
          ],
          completed: [
            { 
              id: 4, 
              title: 'Fullmetal Alchemist', 
              image_url: 'https://cdn.myanimelist.net/images/manga/3/243675.jpg',
              status: 'completed',
              score: 9.0
            },
            { 
              id: 5, 
              title: 'Death Note', 
              image_url: 'https://cdn.myanimelist.net/images/manga/2/54453.jpg',
              status: 'completed',
              score: 8.8
            }
          ],
          onHold: [
            { 
              id: 6, 
              title: 'Attack on Titan', 
              image_url: 'https://cdn.myanimelist.net/images/manga/2/37846.jpg',
              status: 'on-hold',
              score: 8.6
            }
          ],
          dropped: [],
          planToRead: [
            { 
              id: 7, 
              title: 'Vagabond', 
              image_url: 'https://cdn.myanimelist.net/images/manga/1/259070.jpg',
              status: 'plan-to-read',
              score: null
            },
            { 
              id: 8, 
              title: 'Berserk', 
              image_url: 'https://cdn.myanimelist.net/images/manga/1/157897.jpg',
              status: 'plan-to-read',
              score: null
            },
            { 
              id: 9, 
              title: 'Vinland Saga', 
              image_url: 'https://cdn.myanimelist.net/images/manga/2/188925.jpg',
              status: 'plan-to-read',
              score: null
            }
          ]
        };
        
        setLibrary(dummyData);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error loading library',
          description: 'Failed to load your manga library.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };
    
    fetchUserLibrary();
  }, [user, toast]);

  const sortManga = (mangaList) => {
    if (!mangaList) return [];
    
    return [...mangaList].sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'score') {
        return (b.score || 0) - (a.score || 0);
      } else {
        return 0;
      }
    });
  };

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your library...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={6}>
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h1" size="xl">My Manga Library</Heading>
            <Select 
              width="200px" 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="score">Sort by Score</option>
            </Select>
          </Flex>
        </Box>
        
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Reading ({library.reading?.length || 0})</Tab>
            <Tab>Completed ({library.completed?.length || 0})</Tab>
            <Tab>On Hold ({library.onHold?.length || 0})</Tab>
            <Tab>Dropped ({library.dropped?.length || 0})</Tab>
            <Tab>Plan to Read ({library.planToRead?.length || 0})</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              {library.reading?.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6}>
                  {sortManga(library.reading).map(manga => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>You don't have any manga in your reading list.</Text>
                  <Button as={Link} to="/browse" colorScheme="blue">Browse Manga</Button>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel>
              {library.completed?.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6}>
                  {sortManga(library.completed).map(manga => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>You haven't completed any manga yet.</Text>
                  <Button as={Link} to="/browse" colorScheme="blue">Browse Manga</Button>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel>
              {library.onHold?.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6}>
                  {sortManga(library.onHold).map(manga => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>You don't have any manga on hold.</Text>
                  <Button as={Link} to="/browse" colorScheme="blue">Browse Manga</Button>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel>
              {library.dropped?.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6}>
                  {sortManga(library.dropped).map(manga => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>You haven't dropped any manga.</Text>
                  <Button as={Link} to="/browse" colorScheme="blue">Browse Manga</Button>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel>
              {library.planToRead?.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6}>
                  {sortManga(library.planToRead).map(manga => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>You don't have any manga in your plan-to-read list.</Text>
                  <Button as={Link} to="/browse" colorScheme="blue">Browse Manga</Button>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default UserLibrary; 