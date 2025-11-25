export const ASSETS = [
  { 
    id: 'red', 
    name: 'Red & White',
    previewUrl: 'https://res.cloudinary.com/yoav-cloud/image/upload/v1763114784/create/shoes/red-white-sneaker-transparent.png', 
    publicId: 'create/shoes/red-white-sneaker-transparent' 
  },
  { 
    id: 'white', 
    name: 'White & Blue',
    previewUrl: 'https://res.cloudinary.com/yoav-cloud/image/upload/v1763114784/create/shoes/sneakers-white_blue-transparent.png', 
    publicId: 'create/shoes/sneakers-white_blue-transparent' 
  },
  { 
    id: 'blue', 
    name: 'Blue',
    previewUrl: 'https://res.cloudinary.com/yoav-cloud/image/upload/v1763114784/create/shoes/blue-sneakers-transparent.png', 
    publicId: 'create/shoes/blue-sneakers-transparent' 
  }
]

export const DESIGN_TYPES = [
  {
    id: 'parent',
    name: 'Main Design',
    width: 500,
    height: 900,
    description: 'Vertical layout (500x900)'
  },
  {
    id: 'ig-ad',
    name: 'Instagram Ad',
    width: 1080,
    height: 1080,
    description: 'Square format (1:1)'
  },
  {
    id: 'fb-mobile',
    name: 'FB Mobile Feed',
    width: 1080,
    height: 1350,
    description: 'Vertical format (4:5)'
  }
]

export const BASE_WIDTH = 500

export const GRAVITY_VALUES = {
  northEast: 'north_east',
  north: 'north',
  northWest: 'north_west',
  west: 'west',
  southWest: 'south_west',
  south: 'south',
  southEast: 'south_east',
  east: 'east',
  center: 'center'
}

// Google Fonts list - 15 popular fonts
export const GOOGLE_FONTS = [
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Ubuntu', value: 'Ubuntu' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Bebas Neue', value: 'Bebas Neue' },
  { name: 'Arial', value: 'Arial' } // Keep Arial as default/fallback
]

export const LIGHT_BLUE = '#03a9f4'

// Design positioning rules - one entry per design type
// Each rule contains: width, height (canvas dimensions), x, y, gravity, fontSize (and width/height for image)
// fontSize can be a number (absolute) or a string with percentage (e.g., "50%") relative to a parent value
export const DESIGN_RULES = {
  'parent': {
    width: 500,
    height: 900,
    showLogo: true,
    logoPublicId: 'create/shoes/shoe-logo-small',
    logo: { width: 100, height: 100, x: 10, y: 0, gravity: GRAVITY_VALUES.northEast, order: 1, displayName: 'Logo' },
    title: { 
      x: 20, y: 70, gravity: GRAVITY_VALUES.northWest, fontSize: 32, color: '#ffffff', font: 'Arial', 
      flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 400,
      fieldName: 'title', bold: true, order: 2,
      metadataKey: 'ptitle', defaultValue: 'Now on Sale', displayName: 'Title',
      textWidthMultiplier: 0.53
    },
    tagline: { 
      x: 30, y: 120, gravity: GRAVITY_VALUES.northEast, fontSize: 20, color: '#ffffff', font: 'Arial', 
      flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 400,
      fieldName: 'tagline', italic: true, order: 3,
      metadataKey: 'pdescription', defaultValue: 'Limited Time Offer', displayName: 'Tagline',
      textWidthMultiplier: 0.63
    },
    image: { width: 300, height: 300, x: 10, y: 30, gravity: GRAVITY_VALUES.southEast, order: 4, displayName: 'Main Image' },
    origPrice: { 
      x: 30, y: 40, gravity: GRAVITY_VALUES.southWest, fontSize: 30, color: '#bbbbbb', font: 'Arial', 
      flNoOverflow: false, flTextDisallowOverflow: false,
      calculation: { formula: 'mul_1.25', dependsOn: 'price' },
      strikethrough: true, order: 5, displayName: 'Original Price',
      textWidthMultiplier: 0.45
    },
    price: { 
      x: 130, y: 40, gravity: GRAVITY_VALUES.southWest, fontSize: 44, color: '#ffffff', font: 'Arial', 
      flNoOverflow: false, flTextDisallowOverflow: false,
      fieldName: 'price', bold: true, prefix: '$', isNumber: true, order: 6,
      metadataKey: 'pprice', defaultValue: '80', displayName: 'Price',
      textWidthMultiplier: 0.35
    }
  },
  'ig-ad': {
    width: 1080,
    height: 1080,
    showLogo: true,
    logoPublicId: 'create/shoes/shoe-logo-small',
    logo: { width: 100, height: 100,  x: 10, y: 0, gravity: GRAVITY_VALUES.northEast, order: 1, displayName: 'Logo' },
    title: { 
      x: 0, y: 80, gravity: GRAVITY_VALUES.north, fontSize: "110%", color: '#ffffff', font: 'Arial', 
      flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864,
      fieldName: 'title', bold: true, order: 2,
      metadataKey: 'ptitle', defaultValue: 'Now on Sale', displayName: 'Title'
    },
    tagline: { 
      x: 0, y: 100, gravity: GRAVITY_VALUES.north, fontSize: 20, color: '#ffffff', font: 'Arial', 
      flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864,
      fieldName: 'tagline', italic: true, order: 3,
      metadataKey: 'pdescription', defaultValue: 'Limited Time Offer', displayName: 'Tagline'
    },
    image: { width: 350, height: 250, x: 0, y: 120, gravity: GRAVITY_VALUES.north, order: 4, displayName: 'Main Image' },
    origPrice: { 
      x: -44, y: 60, gravity: GRAVITY_VALUES.south, fontSize: 30, color: '#bbbbbb', font: 'Arial', 
      flNoOverflow: false, flTextDisallowOverflow: false,
      calculation: { formula: 'mul_1.25', dependsOn: 'price' },
      strikethrough: true, order: 5, displayName: 'Original Price'
    },
    price: { 
      x: 0, y: 50, gravity: GRAVITY_VALUES.south, fontSize: 44, color: '#ffffff', font: 'Arial', 
      flNoOverflow: false, flTextDisallowOverflow: false,
      fieldName: 'price', bold: true, prefix: '$', isNumber: true, order: 6,
      metadataKey: 'pprice', defaultValue: '80', displayName: 'Price'
    }
  },
  'fb-mobile': {
    width: 1080,
    height: 1350,
    showLogo: true,
    logoPublicId: 'create/shoes/shoe-logo-small',
    logo: { width: 100, height: 100, x: 10, y: 0, gravity: GRAVITY_VALUES.northEast, order: 1, displayName: 'Logo' },
    title: { 
      x: 0, y: 30, gravity: GRAVITY_VALUES.north, fontSize: 32, color: '#ffffff', font: 'Arial', 
      flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864,
      fieldName: 'title', bold: true, order: 2,
      metadataKey: 'ptitle', defaultValue: 'Now on Sale', displayName: 'Title'
    },
    tagline: { 
      x: 0, y: 60, gravity: GRAVITY_VALUES.south, fontSize: 20, color: '#ffffff', font: 'Arial', 
      flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864,
      fieldName: 'tagline', italic: true, order: 3,
      metadataKey: 'pdescription', defaultValue: 'Limited Time Offer', displayName: 'Tagline'
    },
    image: { width: 380, height: 280, x: 0, y: 60, gravity: GRAVITY_VALUES.center, order: 4, displayName: 'Main Image' },
    origPrice: { 
      x: 0, y: -140, gravity: GRAVITY_VALUES.center, fontSize: "120%", color: '#bbbbbb', font: 'Arial', 
      flNoOverflow: false, flTextDisallowOverflow: false,
      calculation: { formula: 'mul_1.25', dependsOn: 'price' },
      strikethrough: true, order: 5, displayName: 'Original Price'
    },
    price: { 
      x: 0, y: -120, gravity: GRAVITY_VALUES.center, fontSize: "150%", color: '#ffffff', font: 'Arial', 
      flNoOverflow: false, flTextDisallowOverflow: false,
      fieldName: 'price', bold: true, prefix: '$', isNumber: true, order: 6,
      metadataKey: 'pprice', defaultValue: '80', displayName: 'Price'
    }
  }
}

