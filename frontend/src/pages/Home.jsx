import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  SimpleGrid,
  Image,
  Flex,
  VStack,
  HStack,
  Tag,
  Skeleton
} from '@chakra-ui/react';
import { getMangaList } from '../services/mangaService';

export default function Home() {
  const [featuredManga, setFeaturedManga] = useState([]);
  const [popularManga, setPopularManga] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get some random manga for featured section
        const featured = await getMangaList(1, 3);
        setFeaturedManga(featured.results || []);
        
        // Get popular manga
        const popular = await getMangaList(1, 6, '', [], 4.5);
        setPopularManga(popular.results || []);
      } catch (error) {
        console.error('Error fetching manga data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  return (
    <Box>
      {/* Hero Section */}
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 28 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Discover and Track <br />
            <Text as={'span'} color={'brand.500'}>
              Your Manga Journey
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Join MangaList to track your manga reading progress, discover new 
            titles based on your interests, and connect with a community of 
            fellow manga enthusiasts. With over 70,000 titles in our database, 
            you'll never run out of amazing manga to read.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              as={RouterLink}
              to={'/browse'}
              colorScheme={'brand'}
              bg={'brand.500'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'brand.600',
              }}>
              Browse Manga
            </Button>
            <Button
              as={RouterLink}
              to={'/register'}
              variant={'link'}
              colorScheme={'brand'}
              size={'sm'}>
              Create Free Account
            </Button>
            <Box>
              <Icon
                as={Arrow}
                color={useColorModeValue('gray.800', 'gray.300')}
                w={71}
                position={'absolute'}
                right={-71}
                top={'10px'}
              />
              <Text
                fontSize={'lg'}
                fontFamily={'Caveat'}
                position={'absolute'}
                right={'-125px'}
                top={'-15px'}
                transform={'rotate(10deg)'}>
                Join for free!
              </Text>
            </Box>
          </Stack>
        </Stack>
      </Container>

      {/* Featured Manga Section */}
      <Box bg={useColorModeValue('brand.50', 'gray.900')} py={16}>
        <Container maxW={'6xl'}>
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Featured Manga
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {loading ? (
              Array(3).fill(0).map((_, index) => (
                <Box key={index} borderRadius="lg" overflow="hidden" bg="white" boxShadow="md">
                  <Skeleton height="250px" />
                  <Box p={6}>
                    <Skeleton height="20px" mb={4} />
                    <Skeleton height="15px" mb={2} />
                    <Skeleton height="15px" mb={2} />
                    <Skeleton height="15px" />
                  </Box>
                </Box>
              ))
            ) : (
              featuredManga.map((manga) => (
                <Box 
                  key={manga.id} 
                  borderRadius="lg" 
                  overflow="hidden" 
                  bg="white" 
                  boxShadow="md"
                  transition="transform 0.3s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <Image
                    src={manga.cover && manga.cover.startsWith('http') ? manga.cover : 
                         manga.cover ? `${window.location.origin}/static/${manga.cover}` : 
                         'https://via.placeholder.com/300x450?text=No+Cover'}
                    alt={manga.title}
                    height="250px"
                    width="100%"
                    objectFit="cover"
                    fallback={<Box height="250px" width="100%" bg="gray.200" />}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                    }}
                  />
                  <Box p={6}>
                    <Heading as="h3" size="md" mb={2} noOfLines={1}>
                      {manga.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" mb={4} noOfLines={3}>
                      {manga.description}
                    </Text>
                    <HStack>
                      {manga.tags && manga.tags.slice(0, 3).map((tag, index) => (
                        <Tag key={index} size="sm" colorScheme="brand" variant="subtle">
                          {tag.replace(/[\[\]']/g, '').trim()}
                        </Tag>
                      ))}
                    </HStack>
                    <Button 
                      as={RouterLink}
                      to={`/manga/${manga.id}`}
                      mt={4}
                      colorScheme="brand"
                      size="sm"
                      width="full"
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Popular Manga Section */}
      <Container maxW={'6xl'} py={16}>
        <Heading as="h2" size="xl" mb={8}>
          Popular Manga
        </Heading>
        
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing={5}>
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <Box key={index} borderRadius="lg" overflow="hidden" bg="white" boxShadow="sm">
                <Skeleton height="180px" />
                <Box p={3}>
                  <Skeleton height="15px" mb={2} />
                  <Skeleton height="10px" />
                </Box>
              </Box>
            ))
          ) : (
            popularManga.map((manga) => (
              <Box 
                key={manga.id} 
                borderRadius="lg" 
                overflow="hidden" 
                bg="white" 
                boxShadow="sm"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
                as={RouterLink}
                to={`/manga/${manga.id}`}
              >
                <Image
                  src={manga.cover && manga.cover.startsWith('http') ? manga.cover : 
                       manga.cover ? `${window.location.origin}/static/${manga.cover}` : 
                       'https://via.placeholder.com/200x300?text=No+Cover'}
                  alt={manga.title}
                  height="180px"
                  width="100%"
                  objectFit="cover"
                  fallback={<Box height="180px" width="100%" bg="gray.200" />}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                  }}
                />
                <Box p={3}>
                  <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                    {manga.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Rating: {manga.rating} ★
                  </Text>
                </Box>
              </Box>
            ))
          )}
        </SimpleGrid>
        
        <Flex justify="center" mt={10}>
          <Button
            as={RouterLink}
            to="/browse"
            size="lg"
            colorScheme="brand"
            variant="outline"
          >
            View All Manga
          </Button>
        </Flex>
      </Container>

      {/* Community Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW={'5xl'}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Stack spacing={4}>
              <Heading>Join Our Manga Community</Heading>
              <Text color={'gray.500'} fontSize={'lg'}>
                Connect with fellow manga enthusiasts, share your thoughts through reviews, 
                and build your personalized manga library. Track your reading progress and 
                get recommendations based on your preferences.
              </Text>
              <Stack direction={'row'} spacing={4} align={'center'}>
                <Button
                  as={RouterLink}
                  to={'/register'}
                  rounded={'full'}
                  bg={'brand.500'}
                  color={'white'}
                  _hover={{
                    bg: 'brand.600',
                  }}>
                  Join Now
                </Button>
                <Button
                  as={RouterLink}
                  to={'/about'}
                  rounded={'full'}
                  variant={'outline'}>
                  Learn More
                </Button>
              </Stack>
            </Stack>
            <Flex>
              <Image
                rounded={'md'}
                alt={'feature image'}
                src={'https://source.unsplash.com/random/600x360/?manga,anime,bookshelf'}
                objectFit={'cover'}
              />
            </Flex>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
}); 