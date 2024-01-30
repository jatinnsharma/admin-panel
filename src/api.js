export const baseUrl = "http://localhost:8000/api/v1"

export const updateProfileUrl=`${baseUrl}/auth/update-user-profile`;
export const getOwnDetailsUrl=`${baseUrl}/auth/get-own-details`;
export const loginUrl=`${baseUrl}/auth/login-admin-only`;
export const forgortPasswordUrl = `${baseUrl}/auth/forgot-password`;

export const changePasswordUrl = `${baseUrl}/auth/change-password`
export const checkLoggedInStatusUrl = `${baseUrl}/auth/login-status`
export const loggoutUrl = `${baseUrl}/auth/logout`
export const deleteUrl = `${baseUrl}/delete-user`;

export const url = `${baseUrl}/filter-user`;
export const changeUserRoleURl = `${baseUrl}/upgradeRole`;
export const getUserDetailsURL = `${baseUrl}/get-user-details`
export const updateUserDetailsURL = `${baseUrl}/update-user-details`

export const getChatDetailsURL = `${baseUrl}/chat/`
export const createChatURL = `${baseUrl}/chat`
export const getMessageURL = `${baseUrl}/message`
export const addNewMessageURL = `${baseUrl}/message`

export const sendImageURL = `${baseUrl}/message`