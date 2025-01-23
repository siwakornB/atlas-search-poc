

export function validateYear(year: any) {
    const currentYear = new Date().getFullYear()
    const yearEnd = Number(year)
    if (isNaN(+yearEnd) || yearEnd < 0 || yearEnd > currentYear) {
      return false
    }
    if (yearEnd > currentYear) {
      return false
    }
}