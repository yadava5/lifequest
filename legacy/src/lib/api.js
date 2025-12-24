const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const handleResponse = async (promise) => {
  const response = await promise;
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.details = errorBody?.issues;
    throw error;
  }
  return response.json();
};

export const fetchUser = (userId) =>
  handleResponse(fetch(`${API_BASE_URL}/users/${userId}`));

export const createUser = (payload) =>
  handleResponse(
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

export const updateUser = (userId, payload) =>
  handleResponse(
    fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

export const resetUser = (userId) =>
  handleResponse(
    fetch(`${API_BASE_URL}/users/${userId}/reset`, {
      method: 'POST',
    })
  );

export const fetchQuests = (userId) =>
  handleResponse(fetch(`${API_BASE_URL}/quests?userId=${encodeURIComponent(userId)}`));

export const completeQuest = (userId, questId) =>
  handleResponse(
    fetch(`${API_BASE_URL}/quests/${questId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
  );

export const fetchRewards = () => handleResponse(fetch(`${API_BASE_URL}/rewards`));

export const redeemReward = (userId, rewardId) =>
  handleResponse(
    fetch(`${API_BASE_URL}/rewards/${rewardId}/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
  );

export const fetchMeetups = (audience) => {
  const query = audience ? `?audience=${audience}` : '';
  return handleResponse(fetch(`${API_BASE_URL}/meetups${query}`));
};

export const fetchHealth = () => handleResponse(fetch(`${API_BASE_URL}/health`));

export const signInUser = ({ email, password }) =>
  handleResponse(
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  );

export const signUpUser = ({ name, email, password, audience }) =>
  handleResponse(
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, audience }),
    })
  );
