# MiCIBA

Aplicación móvil desarrollada con Expo + React Native + TypeScript para facilitar la búsqueda de profesionales de salud y la gestión de turnos desde el teléfono. El proyecto combina navegación por tabs y stacks, persistencia local con SQLite y sincronización con Firebase cuando hay conexión.

El flujo principal contempla autenticación, listado y detalle de doctores, reserva de turnos y un perfil de usuario con foto y ubicación. En modo sin conexión se usa caché local y se reintenta la sincronización al recuperar internet.

## Características principales
- Autenticación con email y contraseña.
- Home con acceso a secciones principales.
- Listado, búsqueda y detalle de doctores con datos remotos y fallback local.
- Reserva de turnos y visualización en "Mis turnos".
- Perfil con foto (cámara/galería) y ubicación.
- Sincronización online/offline de perfil y turnos.

## Instalación y ejecución
1) Instalar dependencias:
```bash
npm install
```

2) Iniciar el proyecto:
```bash
npx expo start -c
```

3) Ejecutar en plataforma específica:
```bash
npm run android
npm run ios
npm run web
```

## Estructura del proyecto
```
.
├── app/
│   ├── _layout.tsx
│   └── index.tsx
├── assets/
│   ├── icon.png
│   ├── logo.png
│   ├── splash.png
│   └── onboarding/
├── src/
│   ├── components/
│   │   ├── appointments/
│   │   ├── doctors/
│   │   ├── notifications/
│   │   └── ui/
│   ├── constants/
│   ├── database/
│   ├── navigation/
│   ├── screens/
│   │   ├── appointments/
│   │   ├── auth/
│   │   ├── doctors/
│   │   ├── home/
│   │   ├── menu/   
│   │   ├── notification/
│   │   ├── placeholders/
│   │   ├── profile/
│   │   └── settings/
│   ├── services/
│   │   └── firebase/
│   ├── store/
│   │   └── slices/
│   ├── types/
│   └── utils/
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```