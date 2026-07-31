/**
 * Solcafe Theme Manager
 * Handles applying seasonal and role-based themes
 */

/**
 * Determines the current season based on the date
 * @returns {string} season - 'spring', 'summer', 'autumn', or 'winter'
 */
export function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth();

  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

/**
 * Applies a theme by adding a class to the root element
 * @param {string} themeType - 'theme' for seasonal, 'role' for role-based
 * @param {string} themeName - The specific theme to apply
 */
export function applyTheme(themeType, themeName) {
  // Clear any existing themes of this type
  document.documentElement.classList.forEach((cls) => {
    if (cls.startsWith(`${themeType}-`)) {
      document.documentElement.classList.remove(cls);
    }
  });

  // Apply new theme
  document.documentElement.classList.add(`${themeType}-${themeName}`);

  // Save preference if needed
  if (themeType === "theme") {
    localStorage.setItem("preferred-theme", themeName);
  }
}

/**
 * Initializes themes based on season and user role
 * @param {Object} user - User object with role information
 */
export function initializeThemes(user) {
  // Apply seasonal theme (can be overridden by user preference)
  const preferredTheme = localStorage.getItem("preferred-theme");
  const seasonalTheme = preferredTheme || getCurrentSeason();
  applyTheme("theme", seasonalTheme);

  // Apply role-based theme if user is logged in
  if (user?.primary_role) {
    const role = user.primary_role.toLowerCase();
    applyTheme("role", role);
  }
}
