import axiosInstance from './axiosInstance';  // Import the custom axios instance

export const registerUser = async (userData) => {
  const response = await axiosInstance.post(`/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`/login`, userData);
    if (response.data && response.data.data && response.data.data.token && response.data.data.user) {
      return response.data.data; 
    } else {
      throw new Error("Login failed: Invalid response structure");
    }
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Something went wrong");
  }
};


export const createCandidate = async (candidateData) => {
  const response = await axiosInstance.post(`/candidates`, candidateData);
  return response.data;
};

export const getCandidates = async () => {
  const response = await axiosInstance.get(`/candidates`);
  return response.data;
};

export const updateCandidate = async (id, candidateData) => {
  const response = await axiosInstance.put(`/candidates/${id}`, candidateData);
  return response.data;
};

export const deleteCandidate = async (id) => {
  const res = await axiosInstance.delete(`/candidates/${id}`);
  return res.data;
};

export const updateCandidateStatus = async (id, newStatus) => {
  const response = await axiosInstance.patch(`/candidates/${id}/status`, {
    status: newStatus.status
  });
  return response.data;
};

export const getAttendance = async () => {
  const response = await axiosInstance.get(`/getAttendance`);
  return response.data;
};

export const markCandidateAttendance = async (id, attendance) => {
  const response = await axiosInstance.put(`/markAttendance/${id}`, {
    attendance,
  });
  return response.data;
};

export const createLeave = async (leaveData) => {
  const response = await axiosInstance.post(`/leave`, leaveData);
  return response.data;
};

export const getLeaves = async () => {
  const response = await axiosInstance.get(`/leave`);
  return response.data;
};

export const updateLeaveStatus = async (id, newStatus) => {
  const response = await axiosInstance.put(`/leave/${id}`, {
    status: newStatus.status
  });
  return response.data;
};

export const deleteLeave = async (id) => {
  const response = await axiosInstance.delete(`/leave/${id}`);
  return response.data;
};


export const getProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};