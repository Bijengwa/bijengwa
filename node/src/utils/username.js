function slugifyName(fullName) {
  return fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 20) || 'user';
}

function generateUsername(fullName) {
  const base = slugifyName(fullName);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
}

module.exports = { generateUsername };
