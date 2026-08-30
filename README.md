# Ipial Abogados

Sitio web institucional para el estudio jurídico Ipial Abogados.

## 🚀 Stack Tecnológico

- **Framework**: [Astro](https://astro.build/)
- **UI**: [React](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **Gestor de Paquetes**: [pnpm](https://pnpm.io/)
- **Servidor**: [Nginx](https://nginx.org/) (Dockerized)
- **Despliegue**: [Dokploy](https://dokploy.com/)
- **Analíticas**: [Umami](https://umami.is/)

## 🛠️ Instalación y Desarrollo

### Requisitos previos
- Node.js (LTS)
- pnpm

### Pasos para ejecutar localmente
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/david14122720/Ipial_abogados.git
   cd Ipial_abogados
   ```
2. Instalar dependencias:
   ```sh
   pnpm install
   ```
3. Iniciar servidor de desarrollo:
   ```sh
   pnpm run dev
   ```

## 📦 Despliegue

El proyecto está preparado para ser desplegado mediante Docker utilizando un Dockerfile optimizado para pnpm y Nginx, compatible con Dokploy.

---
## Fuente canónica

**Ipialabogados.md — fuente canónica (225 líneas) — §3/§4**: este archivo es la única fuente autorizada para servicios y especialidades. `src/components/Services.astro`, `src/components/Team.astro`, `src/content.config.ts` y `src/content/**` deben transcribirlo verbatim (§6: sin invención ni atribución cruzada).

---

*Este proyecto es propiedad de Ipial Abogados.*
