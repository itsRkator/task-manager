const filterUser = (user) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  id: user._id,
  email: user.email,
  avatar: user.avatar,
});

module.exports = { filterUser };
