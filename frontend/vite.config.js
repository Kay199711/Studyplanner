import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    force: true,
    include: [
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction',
    ],
  }, // ✅ <-- this was missing
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    force: true,
    include: [
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction',
    ],
  },
})
