const checkUserData = (firstName, lastName, email, password) => {
  if (!firstName || !lastName || !email || !password) {
    return false;
  } else {
    return true;
  }
};

module.exports.checkUserData = checkUserData;
