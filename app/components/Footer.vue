<template>
  <footer class="weather-footer">
    <!-- Gradient Separator -->
    <div class="footer-separator"></div>
    
    <div class="footer-container">
      <!-- Brand & Description Section -->
      <div class="footer-section footer-brand">
        <div class="brand-wrapper">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <h3 class="brand-name">WeatherPro</h3>
        </div>
        <p class="brand-description">
          Prévisions météorologiques précises et données climatiques en temps réel 
          pour vous aider à planifier votre journée en toute confiance.
        </p>
        <div class="data-sources">
          <span class="source-badge">Données certifiées</span>
          <span class="source-badge">Mises à jour en temps réel</span>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h4 class="section-title">Navigation</h4>
        <nav class="footer-nav">
          <NuxtLink to="/" class="footer-link">Accueil</NuxtLink>
          <NuxtLink to="/previsions" class="footer-link">Prévisions</NuxtLink>
          <NuxtLink to="/radar" class="footer-link">Radar météo</NuxtLink>
          <NuxtLink to="/alertes" class="footer-link">Alertes</NuxtLink>
          <NuxtLink to="/cartes" class="footer-link">Cartes interactives</NuxtLink>
        </nav>
      </div>

      <!-- Resources -->
      <div class="footer-section">
        <h4 class="section-title">Ressources</h4>
        <nav class="footer-nav">
          <NuxtLink to="/api" class="footer-link">API Développeurs</NuxtLink>
          <NuxtLink to="/blog" class="footer-link">Blog météo</NuxtLink>
          <NuxtLink to="/education" class="footer-link">Comprendre la météo</NuxtLink>
          <NuxtLink to="/faq" class="footer-link">FAQ</NuxtLink>
          <NuxtLink to="/support" class="footer-link">Support technique</NuxtLink>
        </nav>
      </div>

      <!-- Contact & Legal -->
      <div class="footer-section">
        <h4 class="section-title">Informations</h4>
        <nav class="footer-nav">
          <NuxtLink to="/about" class="footer-link">À propos</NuxtLink>
          <NuxtLink to="/contact" class="footer-link">Contact</NuxtLink>
          <NuxtLink to="/privacy" class="footer-link">Confidentialité</NuxtLink>
          <NuxtLink to="/terms" class="footer-link">Conditions d'utilisation</NuxtLink>
          <NuxtLink to="/accessibility" class="footer-link">Accessibilité</NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Weather Data Info Bar -->
    <div class="data-info-bar">
      <div class="data-info-container">
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Dernière mise à jour: <strong>{{ lastUpdate }}</strong></span>
        </div>
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Sources: <strong>Météo France, ECMWF, NOAA</strong></span>
        </div>
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <span>Précision: <strong>98.5%</strong></span>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <div class="bottom-container">
        <div class="copyright">
          <p>© {{ currentYear }} WeatherPro. Tous droits réservés.</p>
        </div>
        
        <div class="social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener" class="social-link" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener" class="social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>

        <div class="language-selector">
          <select class="language-select" aria-label="Sélectionner la langue">
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Reactive data
const lastUpdate = ref('--:--');
const currentYear = computed(() => new Date().getFullYear());

// Update time on mount
onMounted(() => {
  updateLastUpdateTime();
  // Update every minute
  setInterval(updateLastUpdateTime, 60000);
});

function updateLastUpdateTime() {
  const now = new Date();
  lastUpdate.value = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
</script>

<style scoped>
.weather-footer {
  --footer-bg: #0a1628;
  --footer-bg-secondary: #0f1f38;
  --footer-text: #e2e8f0;
  --footer-text-muted: #94a3b8;
  --footer-accent: #3b82f6;
  --footer-accent-hover: #60a5fa;
  --footer-border: #1e293b;
  
  background: var(--footer-bg);
  color: var(--footer-text);
  position: relative;
  overflow: hidden;
}

/* Gradient Separator */
.footer-separator {
  height: 4px;
  background: linear-gradient(90deg, 
    #3b82f6 0%, 
    #8b5cf6 25%, 
    #ec4899 50%, 
    #f59e0b 75%, 
    #10b981 100%
  );
  background-size: 200% 100%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Main Container */
.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 3rem;
}

/* Brand Section */
.footer-brand {
  padding-right: 2rem;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.brand-icon {
  width: 36px;
  height: 36px;
  color: var(--footer-accent);
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.brand-description {
  color: var(--footer-text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.data-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.source-badge {
  background: var(--footer-bg-secondary);
  border: 1px solid var(--footer-border);
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--footer-text-muted);
  transition: all 0.3s ease;
}

.source-badge:hover {
  border-color: var(--footer-accent);
  color: var(--footer-accent);
  transform: translateY(-2px);
}

/* Footer Sections */
.footer-section {
  animation: fadeInUp 0.6s ease backwards;
}

.footer-section:nth-child(2) { animation-delay: 0.1s; }
.footer-section:nth-child(3) { animation-delay: 0.2s; }
.footer-section:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--footer-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: var(--footer-accent);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: var(--footer-text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 0;
  display: inline-block;
  width: fit-content;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--footer-accent);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: var(--footer-accent);
  padding-left: 12px;
}

.footer-link:hover::before {
  opacity: 1;
  left: 0;
}

/* Data Info Bar */
.data-info-bar {
  background: var(--footer-bg-secondary);
  border-top: 1px solid var(--footer-border);
  border-bottom: 1px solid var(--footer-border);
  padding: 1.5rem 2rem;
  margin-top: 2rem;
}

.data-info-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--footer-text-muted);
  font-size: 0.9rem;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: var(--footer-accent);
}

.info-item strong {
  color: var(--footer-text);
  font-weight: 600;
}

/* Bottom Bar */
.footer-bottom {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid var(--footer-border);
  padding: 1.5rem 2rem;
}

.bottom-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.copyright p {
  color: var(--footer-text-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--footer-bg-secondary);
  border: 1px solid var(--footer-border);
  border-radius: 50%;
  color: var(--footer-text-muted);
  transition: all 0.3s ease;
}

.social-link svg {
  width: 18px;
  height: 18px;
}

.social-link:hover {
  background: var(--footer-accent);
  border-color: var(--footer-accent);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
}

/* Language Selector */
.language-selector {
  position: relative;
}

.language-select {
  background: var(--footer-bg-secondary);
  border: 1px solid var(--footer-border);
  color: var(--footer-text);
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
}

.language-select:hover {
  border-color: var(--footer-accent);
}

.language-select:focus {
  outline: none;
  border-color: var(--footer-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-container {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  .footer-section:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 3rem 1.5rem 2rem;
  }
  
  .footer-brand {
    padding-right: 0;
  }
  
  .data-info-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .info-item {
    width: 100%;
    justify-content: center;
  }
  
  .bottom-container {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-separator {
    height: 3px;
  }
  
  .brand-name {
    font-size: 1.5rem;
  }
  
  .brand-icon {
    width: 30px;
    height: 30px;
  }
  
  .data-sources {
    flex-direction: column;
  }
  
  .source-badge {
    text-align: center;
  }
}
</style>
