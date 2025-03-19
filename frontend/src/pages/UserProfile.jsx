import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Avatar,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const UserProfile = () => {
  const { user, updateUserInfo } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    avatar: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    mangaRead: 0,
    currentlyReading: 0,
    planToRead: 0
  });
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
      
      // Simulate fetching user stats
      const fetchUserStats = async () => {
        try {
          // In a real application, this would be a real API call
          // const response = await axios.get(`http://localhost:8000/api/users/${user.id}/stats`);
          // setStats(response.data);
          
          // For now, just set some dummy data
          setStats({
            mangaRead: 24,
            currentlyReading: 3,
            planToRead: 42
          });
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      };
      
      fetchUserStats();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, this would be a real API call
      // const response = await axios.put(`http://localhost:8000/api/users/${user.id}`, profile, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // For now, just update the local state and show success toast
      updateUserInfo(profile);
      
      toast({
        title: 'Profile updated.',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile.',
        description: error.message || 'An error occurred while updating your profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={8}>
        <Box textAlign="center">
          <Avatar 
            size="2xl" 
            name={profile.username} 
            src={profile.avatar || 'https://via.placeholder.com/150'} 
            mb={4} 
          />
          <Heading as="h1" size="xl">{profile.username}</Heading>
          <Text color="gray.600" fontSize="lg">{profile.email}</Text>
        </Box>
        
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Stack direction="row" justify="space-around" mb={4}>
            <Box textAlign="center">
              <Heading as="h3" size="md">{stats.mangaRead}</Heading>
              <Text>Completed</Text>
            </Box>
            <Box textAlign="center">
              <Heading as="h3" size="md">{stats.currentlyReading}</Heading>
              <Text>Reading</Text>
            </Box>
            <Box textAlign="center">
              <Heading as="h3" size="md">{stats.planToRead}</Heading>
              <Text>Plan to Read</Text>
            </Box>
          </Stack>
        </Box>
        
        <Divider />
        
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Profile</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl id="username">
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                    />
                  </FormControl>
                  
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      isReadOnly
                    />
                  </FormControl>
                  
                  <FormControl id="avatar">
                    <FormLabel>Avatar URL</FormLabel>
                    <Input
                      type="text"
                      name="avatar"
                      value={profile.avatar}
                      onChange={handleChange}
                      placeholder="Enter URL for your avatar"
                    />
                  </FormControl>
                  
                  <FormControl id="bio">
                    <FormLabel>Bio</FormLabel>
                    <Input
                      type="text"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                    />
                  </FormControl>
                  
                  <Button
                    mt={4}
                    colorScheme="blue"
                    isLoading={loading}
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </Stack>
              </form>
            </TabPanel>
            <TabPanel>
              <Text>Account settings will be available here.</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default UserProfile; 