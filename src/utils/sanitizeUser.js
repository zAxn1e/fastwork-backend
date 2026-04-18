function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    birthday: user.birthday,
    telephoneNumber: user.telephoneNumber,
    skills: user.skills || [],
    displayName: user.displayName,
    role: user.role,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  sanitizeUser,
};
