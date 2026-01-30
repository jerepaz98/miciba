export const strings = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Volver',
    continue: 'Continuar',
    accept: 'Aceptar',
    close: 'Cerrar',
    load: 'Cargar',
    loading: 'Cargando',
    error: 'Error'
  },
  auth: {
    welcome: 'Bienvenido/a',
    welcomeTitle: 'MiCIBA',
    welcomeSubtitle: 'Encontrá tu especialista y reservá turnos con facilidad.',
    welcomeBack: 'Bienvenido de nuevo',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    createAccount: 'Crear cuenta',
    creatingAccount: 'Creando...',
    signingIn: 'Ingresando...',
    email: 'Email',
    password: 'Contraseña',
    repeatPassword: 'Repetir contraseña',
    logout: 'Cerrar sesión',
    haveAccount: '¿Ya tenés cuenta? Iniciá sesión',
    newHere: '¿Nuevo por acá? Creá una cuenta',
    validations: {
      invalidEmail: 'Email inválido',
      emailRequired: 'El email es obligatorio',
      passwordRequired: 'La contraseña es obligatoria',
      minPassword: 'Mínimo 6 caracteres'
    }
  },
  home: {
    findYourSpecialist: 'Encontrá tu especialista',
    searchPlaceholder: 'Buscar especialista...',
    categories: 'Categorías',
    availableDoctors: 'Doctores disponibles',
    seeAll: 'Ver todo',
    bannerTitle: 'Buscas un especialista?',
    bannerSubtitle: 'Reserva turnos en minutos',
    quickAccessAppointments: 'Acceso rápido a Mis turnos',
    emergency: 'Emergencia',
    tabLabel: 'Inicio',
    categoryLabels: {
      All: 'Todas',
      Cardiology: 'Cardiología',
      Dermatology: 'Dermatología',
      Pediatrics: 'Pediatría',
      Neurology: 'Neurología',
      General: 'Clínica médica'
    }
  },
  doctors: {
    doctors: 'Doctores',
    doctorDetail: 'Detalle del doctor',
    bookAppointment: 'Reservar turno',
    bookWith: 'Reservar turno con',
    call: 'Llamada',
    videoCall: 'Videollamada',
    message: 'Mensaje',
    experience: 'Experiencia',
    clinic: 'Clínica',
    doctor: 'Doctor',
    searchDoctor: 'Buscar especialista...',
    notFound: 'Doctor no encontrado',
    specialtyLabels: {
      Cardiologist: 'Cardiólogo/a',
      Dermatologist: 'Dermatólogo/a',
      Pediatrician: 'Pediatra',
      Neurologist: 'Neurólogo/a',
      General: 'Clínico/a'
    },
    bioByDoctorId: {
      d1: 'Especialista en prevención cardiovascular y diagnósticos avanzados.',
      d2: 'Enfocado en dermatología clínica y procedimientos estéticos.',
      d3: 'Atención centrada en la familia para niños y adolescentes.'
    }
  },
  appointments: {
    myAppointments: 'Mis turnos',
    upcoming: 'Próximos',
    past: 'Pasados',
    confirmAppointment: 'Confirmar turno',
    cancel: 'Cancelar',
    reschedule: 'Reprogramar',
    date: 'Fecha',
    notes: 'Notas',
    datePlaceholder: 'AAAA-MM-DD',
    notesPlaceholder: 'Escribí una nota',
    synced: 'sincronizado',
    pendingOffline: 'pendiente (offline)',
    syncing: 'Sincronizando...',
    empty: 'Todavía no tenés turnos.'
  },
  notifications: {
    notifications: 'Notificaciones',
    today: 'Hoy',
    yesterday: 'Ayer',
    reminder: 'Recordatorio',
    doctorMessage: 'Mensaje del doctor',
    appointmentConfirmedTitle: 'Turno confirmado',
    appointmentConfirmedMessage: 'Tu turno fue confirmado.',
    newDoctorTitle: 'Nuevo doctor',
    newDoctorMessage: 'Hay un nuevo especialista disponible cerca tuyo.'
  },
  menu: {
    menu: 'Menú',
    profile: 'Perfil',
    myAppointments: 'Mis turnos',
    settings: 'Ajustes',
    settingsSubtitle: 'Notificaciones, privacidad y preferencias de la app.',
    logout: 'Cerrar sesión'
  },
  profile: {
    profile: 'Perfil',
    fullName: 'Nombre completo',
    phone: 'Teléfono',
    profilePhoto: 'Foto de perfil',
    chooseFromGallery: 'Elegir de galería',
    frontCamera: 'Cámara frontal',
    backCamera: 'Cámara trasera',
    location: 'Ubicación',
    address: 'Dirección',
    saveProfile: 'Guardar perfil',
    getLocation: 'Obtener ubicación',
    noAddress: 'Sin dirección todavía',
    savedLocal: 'Perfil guardado localmente',
    syncedFirebase: 'Perfil sincronizado con Firebase',
    syncFailed: 'Guardado localmente. Error al sincronizar con Firebase.'
  },
  permissions: {
    camera: 'Se requiere permiso para usar la cámara.',
    gallery: 'Se requiere permiso para acceder a la galería.',
    location: 'Se requiere permiso para acceder a la ubicación.',
    locationDenied: 'Permiso de ubicación denegado'
  },
  errors: {
    generic: 'Ocurrió un error. Intentá nuevamente.',
    completeFields: 'Completá todos los campos.',
    noConnection: 'Sin conexión',
    loginFailed: 'No se pudo iniciar sesión',
    signupFailed: 'No se pudo crear la cuenta'
  }
};
