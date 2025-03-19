import axios from 'axios';

// Configure axios with token if available
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch manga with pagination and filters
export const getMangaList = async (page = 1, limit = 20, search = '', tags = [], minRating = 0, sortBy = 'popular') => {
  try {
    console.log('Fetching manga with params:', { page, limit, search, tags, minRating, sortBy });
    
    // Create URLSearchParams instance for proper parameter handling
    const params = new URLSearchParams();
    
    // Add basic parameters
    params.append('skip', (page - 1) * limit);
    params.append('limit', limit);
    if (search.trim()) params.append('search', search.trim());
    params.append('min_rating', parseFloat(minRating));
    params.append('sort_by', sortBy);
    
    // Add tags if provided - each tag needs to be added separately for FastAPI's Query parameter
    if (tags && tags.length > 0) {
      const validTags = tags.filter(tag => tag && tag.trim()).map(tag => tag.trim());
      validTags.forEach(tag => {
        params.append('tags', tag);
      });
    }
    
    console.log('Making API request with params:', Object.fromEntries(params));
    const response = await axios.get('/api/manga', { 
      params,
      headers: {
        ...getAuthHeader(),
        'Accept': 'application/json'
      }
    });
    
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching manga list:', error.response?.data || error.message);
    throw error;
  }
};

// Get manga details by ID
export const getMangaById = async (id) => {
  try {
    const response = await axios.get(`/api/manga/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching manga with ID ${id}:`, error);
    throw error;
  }
};

// Get manga reviews
export const getMangaReviews = async (mangaId) => {
  try {
    const response = await axios.get(`/api/manga/${mangaId}/reviews`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for manga ${mangaId}:`, error);
    throw error;
  }
};

// Add manga to user library
export const addToLibrary = async (mangaId, status = 'plan_to_read') => {
  try {
    const response = await axios.post(
      '/api/library', 
      { 
        manga_id: mangaId,
        status
      },
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding manga to library:', error);
    throw error;
  }
};

// Update manga status in library
export const updateLibraryStatus = async (mangaId, status) => {
  try {
    const response = await axios.put(
      `/api/library/${mangaId}`,
      { status },
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating manga status:', error);
    throw error;
  }
};

// Remove manga from library
export const removeFromLibrary = async (mangaId) => {
  try {
    await axios.delete(`/api/library/${mangaId}`, {
      headers: getAuthHeader()
    });
    return true;
  } catch (error) {
    console.error('Error removing manga from library:', error);
    throw error;
  }
};

// Get user's library
export const getUserLibrary = async () => {
  try {
    const response = await axios.get('/api/library', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user library:', error);
    throw error;
  }
};

// Post a review for manga
export const postReview = async (mangaId, content, rating) => {
  try {
    const response = await axios.post(
      `/api/manga/${mangaId}/reviews`,
      { content, rating },
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting review:', error);
    throw error;
  }
};

// Get all available tags
export const getAllTags = async () => {
  try {
    const response = await axios.get('/api/manga/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}; 