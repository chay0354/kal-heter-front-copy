export const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  idNumber: '',
  idPhoto: null,
  additionalRightsHolders: []
}

export const INITIAL_PROPERTY_DATA = {
  council: '',
  city: '',
  street: '',
  propertySize: '',
  lot: '',
  helka: '',
  gush: '',
  photoDate: '',
  propertyPhotos: [],
  plotPhoto: null,
  tabuExtract: null,
  israelLandAuthorityContract: ''
}

export const INITIAL_MEASUREMENT_DATA = {
  surveyorName: '',
  measurementDate: '',
  israelMappingNumber: '',
  pdfFile: null,
  dwfFile: null,
  dwgFile: null
}

export const FORM_STEPS = {
  '/dashboard': null,
  '/property-details-final': '/dashboard',
  '/property-details': '/property-details-final',
  '/home-catalog': '/property-details',
  '/summary': '/home-catalog'
}

export const STEPS = [
  { number: 1, label: 'פרטים אישיים' },
  { number: 2, label: 'מפת מדידה' },
  { number: 3, label: 'פרטי הנכס' },
  { number: 4, label: 'בחירת בית חלומות' },
  { number: 5, label: 'סיכום ושליחה' }
]

export const PROPERTY_FILE_FIELD_MAP = {
  tabuExtract: 'tabu_extract',
  propertyPhotos: 'property_photos',
  plotPhoto: 'plot_photo'
}

export const MEASUREMENT_FILE_FIELD_MAP = {
  pdfFile: 'pdf_file',
  dwfFile: 'dwf_file',
  dwgFile: 'dwg_file'
}

// To add a new card: copy the object below, increment the id, fill in the data.
// Place card images in: public/images/dream-cards/
// They will be accessible at: /images/dream-cards/<filename>
export const DREAM_CARDS = [
  {
    id: 1,
    tag: 'קל״צ',
    title: 'האחוזה של חיים',
    desc: 'Lorem sap.',
    spec: [
      { icon: '/icons/Ruler Angular.png', text: '250 מ״ר' },
      { icon: '/icons/car.png', text: '2 חניות' },
      { icon: '/icons/Bed.png', text: '3 חדרי שינה' },
      { icon: '/icons/Server.png', text: '2 מפלסים' },
    ],
    image: '/images/dream-cards/card-1.jpg',
    drawing: '/images/drawings/01.pdf'
  },
]
