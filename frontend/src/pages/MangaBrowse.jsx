import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  SimpleGrid,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Badge,
  Image,
  Select,
  HStack,
  VStack,
  Checkbox,
  CheckboxGroup,
  useColorModeValue,
  Icon,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import { getMangaList, getAllTags } from '../services/mangaService';

export default function MangaBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [manga, setManga] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const ITEMS_PER_PAGE = 12;
  const [searchInput, setSearchInput] = useState('');
  
  // Parse search params on initial load
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';
    const rating = searchParams.get('rating') || 0;
    const sort = searchParams.get('sort') || 'popular';
    const pageParam = searchParams.get('page') || 1;
    
    setSearchTerm(search);
    setSelectedTags(tags ? tags.split(',') : []);
    setMinRating(parseFloat(rating));
    setSortBy(sort);
    setPage(parseInt(pageParam));
  }, []);
  
  // Fetch tags once on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    
    fetchTags();
  }, []);
  
  // Fetch manga when filters change
  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
      try {
        console.log('Fetching manga with filters:', {
          page,
          searchTerm,
          selectedTags,
          minRating,
          sortBy
        });
        
        const result = await getMangaList(
          page,
          ITEMS_PER_PAGE,
          searchTerm,
          selectedTags,
          minRating,
          sortBy
        );
        
        console.log('Received manga data:', result);
        setManga(result.results || []);
        setTotalPages(Math.ceil(result.total / ITEMS_PER_PAGE) || 1);
      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setLoading(false);
      }
      
      // Update URL search params
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      if (minRating > 0) params.set('rating', minRating.toString());
      if (page > 1) params.set('page', page.toString());
      if (sortBy !== 'popular') params.set('sort', sortBy);
      setSearchParams(params);
    };
    
    fetchManga();
  }, [page, searchTerm, selectedTags, minRating, sortBy, ITEMS_PER_PAGE]);
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1); // Reset to first page on new search
      setSearchTerm(searchInput.trim());
    }
  };
  
  const handleSearchClick = () => {
    setPage(1); // Reset to first page on new search
    setSearchTerm(searchInput.trim());
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  
  const handleTagSelect = (e) => {
    const tag = e.target.value;
    if (tag && !selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setPage(1); // Reset to first page on new filter
      
      // Update URL params immediately
      const params = new URLSearchParams(searchParams);
      params.set('tags', newTags.join(','));
      setSearchParams(params);
    }
  };
  
  const handleTagRemove = (tag) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    setPage(1); // Reset to first page on filter change
    
    // Update URL params immediately
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    setSearchParams(params);
  };
  
  const handleRatingChange = (e) => {
    setMinRating(parseFloat(e.target.value));
    setPage(1); // Reset to first page on filter change
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to first page when changing sort
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  return (
    <Container maxW="7xl" py={8}>
      <Heading as="h1" mb={6}>Browse Manga</Heading>
      
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        gap={6}
        mb={8}
      >
        {/* Filter sidebar */}
        <Box 
          width={{ base: '100%', md: '250px' }}
          bg={useColorModeValue('white', 'gray.800')}
          p={4}
          borderRadius="md"
          boxShadow="sm"
        >
          <VStack align="stretch" spacing={4}>
            <Box>
              <Heading size="sm" mb={2}>Search</Heading>
              <InputGroup>
                <Input 
                  placeholder="Search manga..." 
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearch}
                />
                <InputRightElement>
                  <Button 
                    size="sm" 
                    onClick={handleSearchClick} 
                    variant="ghost"
                  >
                    <SearchIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
            
            <Box>
              <Heading size="sm" mb={2}>Sort By</Heading>
              <Select value={sortBy} onChange={handleSortChange}>
                <option value="popular">Popularity</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
                <option value="title">Title (A-Z)</option>
              </Select>
            </Box>
            
            <Box>
              <Heading size="sm" mb={2}>Minimum Rating</Heading>
              <Select value={minRating} onChange={handleRatingChange}>
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </Select>
            </Box>
            
            <Box>
              <Heading size="sm" mb={2}>Genres</Heading>
              <Select 
                placeholder="Add genre..." 
                onChange={handleTagSelect}
                value=""
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
              
              <HStack flexWrap="wrap" mt={2} spacing={2}>
                {selectedTags.map(tag => (
                  <Tag 
                    key={tag} 
                    size="md" 
                    colorScheme="brand"
                    m={1}
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleTagRemove(tag)} />
                  </Tag>
                ))}
              </HStack>
            </Box>
          </VStack>
        </Box>
        
        {/* Main content */}
        <Box flex="1">
          {loading ? (
            <Flex justify="center" align="center" h="300px">
              <Spinner size="xl" color="brand.500" />
            </Flex>
          ) : manga.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Heading size="md">No manga found</Heading>
              <Text mt={2}>Try changing your search filters</Text>
            </Box>
          ) : (
            <>
              <Text mb={4}>
                Showing {manga.length} of {totalPages * ITEMS_PER_PAGE} results
              </Text>
              
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                {manga.map(item => (
                  <Box
                    key={item.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    bg={useColorModeValue('white', 'gray.800')}
                    transition="transform 0.3s, box-shadow 0.3s"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'xl'
                    }}
                  >
                    <Box position="relative" height="240px">
                      <Image
                        src={item.cover && item.cover.startsWith('http') ? item.cover : 
                             item.cover ? `http://localhost:8000/static/${item.cover}` : 
                             'https://via.placeholder.com/300x400?text=No+Cover'}
                        alt={item.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        fallback={<Box w="100%" h="100%" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                          <Text color="gray.500">No Image</Text>
                        </Box>}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                        }}
                      />
                      <Flex
                        position="absolute"
                        top={2}
                        right={2}
                        bg="rgba(0,0,0,0.7)"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        align="center"
                      >
                        <Icon as={StarIcon} color="yellow.400" mr={1} />
                        <Text fontSize="sm" fontWeight="bold">
                          {item.rating ? item.rating.toFixed(1) : "N/A"}
                        </Text>
                      </Flex>
                    </Box>
                    
                    <Box p={4}>
                      <Heading as="h3" size="md" noOfLines={1} mb={1}>
                        {item.title}
                      </Heading>
                      
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        {item.year || "Unknown year"}
                      </Text>
                      
                      <Text noOfLines={2} fontSize="sm" mb={3}>
                        {item.description}
                      </Text>
                      
                      <HStack flexWrap="wrap" mb={3}>
                        {item.tags && Array.isArray(item.tags) && 
                          item.tags
                            .slice(0, 3)
                            .map((tag, idx) => (
                              <Badge 
                                key={idx} 
                                colorScheme="brand" 
                                mr={1} 
                                mb={1}
                              >
                                {tag.replace(/[\[\]']/g, '').trim()}
                              </Badge>
                            ))
                        }
                      </HStack>
                      
                      <Button
                        as={RouterLink}
                        to={`/manga/${item.id}`}
                        colorScheme="brand"
                        size="sm"
                        width="full"
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Flex justify="center" mt={8}>
                  <HStack>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      isDisabled={page === 1}
                      colorScheme="brand"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show limited page numbers with ellipsis
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <Button
                            key={idx}
                            onClick={() => handlePageChange(pageNum)}
                            colorScheme="brand"
                            variant={pageNum === page ? 'solid' : 'ghost'}
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        (pageNum === 2 && page > 3) ||
                        (pageNum === totalPages - 1 && page < totalPages - 2)
                      ) {
                        return <Text key={idx}>...</Text>;
                      }
                      return null;
                    })}
                    
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      isDisabled={page === totalPages}
                      colorScheme="brand"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              )}
            </>
          )}
        </Box>
      </Flex>
    </Container>
  );
} 