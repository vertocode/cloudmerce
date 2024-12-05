import tinycolor from 'tinycolor2'

interface Palette {
  primary: string
  secondary: string
}

export default function ({ primary, secondary }: Palette) {
  const primaryColor = tinycolor(primary)
  const secondaryColor = tinycolor(secondary)

  const intensities = [100, 200, 300, 400, 500, 600, 700]
  const adjustAmount = 10

  intensities.forEach((intensity) => {
    let adjustedPrimaryColor
    let adjustedSecondaryColor

    if (intensity === 500) {
      adjustedPrimaryColor = primaryColor
      adjustedSecondaryColor = secondaryColor
    }
    else if (intensity < 500) {
      // Lighten colors for intensities less than 500
      adjustedPrimaryColor = primaryColor.clone().lighten(adjustAmount * (500 - intensity) / 100).toString()
      adjustedSecondaryColor = secondaryColor.clone().lighten(adjustAmount * (500 - intensity) / 100).toString()
    }
    else {
      // Darken colors for intensities greater than 500
      adjustedPrimaryColor = primaryColor.clone().darken(adjustAmount * (intensity - 500) / 100).toString()
      adjustedSecondaryColor = secondaryColor.clone().darken(adjustAmount * (intensity - 500) / 100).toString()
    }

    document.documentElement.style.setProperty(`--primary-color-${intensity}`, adjustedPrimaryColor as string)
    document.documentElement.style.setProperty(`--secondary-color-${intensity}`, adjustedSecondaryColor as string)
  })
}
