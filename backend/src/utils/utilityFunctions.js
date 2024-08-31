/**
 * Filters the user object to include only selected fields.
 * @param {Object} user - The user object to filter.
 * @returns {Object} - The filtered user object with specific fields.
 */
const filterUser = (user) => {
  if (!user || typeof user !== "object") {
    throw new Error("Invalid user object");
  }

  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    id: user._id || "",
    email: user.email || "",
    avatar: user.avatar || "",
  };
};

module.exports = { filterUser };
