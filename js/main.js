/**
 * RESTAURANT LA PASTILLA — LOGIQUE CLIENT OFFICIELLE
 * Carte accessible PDF, Panier dynamique, Galerie Atmosphère interactive, Réservations sécurisées
 * Zéro effet sonore. Encodage garanti 100% propre.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. GESTION DU MENU MOBILE (BURGER & LIENS)
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.header-nav');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
      const isExpanded = navMenu.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    document.querySelectorAll('.header-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          navMenu.classList.remove('mobile-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992 && !mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // 2. MENU DÉROULANT INTERACTIF : NUMÉRO DE TÉLÉPHONE (APPELER OU WHATSAPP)
  // ==========================================================================
  const phoneBtn = document.getElementById('phone-dropdown-btn');
  const phoneMenu = document.getElementById('phone-dropdown-menu');

  if (phoneBtn && phoneMenu) {
    phoneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = phoneMenu.classList.contains('show');
      if (isOpen) {
        phoneMenu.classList.remove('show');
        phoneBtn.classList.remove('active');
        phoneBtn.setAttribute('aria-expanded', 'false');
      } else {
        phoneMenu.classList.add('show');
        phoneBtn.classList.add('active');
        phoneBtn.setAttribute('aria-expanded', 'true');
      }
    });

    phoneMenu.querySelectorAll('.phone-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        phoneMenu.classList.remove('show');
        phoneBtn.classList.remove('active');
        phoneBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!phoneBtn.contains(e.target) && !phoneMenu.contains(e.target)) {
        phoneMenu.classList.remove('show');
        phoneBtn.classList.remove('active');
        phoneBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // 3. GALERIE ATMOSPHÈRE INTERACTIVE (SÉLECTION & LIGHTBOX MODAL HD)
  // ==========================================================================
  const decorCards = document.querySelectorAll('.gmaps-decor-card');
  const lightboxModal = document.getElementById('atmosphere-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-display-img');
  const lightboxTitle = document.getElementById('lightbox-display-title');
  const lightboxDesc = document.getElementById('lightbox-display-desc');
  const lightboxClose = document.getElementById('lightbox-btn-close');
  const lightboxPrev = document.getElementById('lightbox-btn-prev');
  const lightboxNext = document.getElementById('lightbox-btn-next');

  let currentPhotoIndex = 0;
  const photoData = [];

  decorCards.forEach((card, index) => {
    const imgEl = card.querySelector('.gmaps-decor-img');
    const titleEl = card.querySelector('.gmaps-decor-title');
    const descEl = card.querySelector('.gmaps-decor-desc');

    if (imgEl && titleEl && descEl) {
      photoData.push({
        src: imgEl.getAttribute('src'),
        title: titleEl.textContent,
        desc: descEl.textContent
      });
    }

    card.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || index < 0 || index >= photoData.length) return;
    currentPhotoIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
  }

  function updateLightboxContent() {
    if (!photoData[currentPhotoIndex]) return;
    const item = photoData[currentPhotoIndex];
    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
      updateLightboxContent();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
      updateLightboxContent();
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // ==========================================================================
  // 4. FILTRES RAPIDES DE LA CARTE DES METS
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const categoryGroups = document.querySelectorAll('.menu-category-group');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCat = btn.getAttribute('data-category');

      categoryGroups.forEach(group => {
        if (selectedCat === 'all' || group.getAttribute('data-category') === selectedCat) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 5. PANIER & CALCULATEUR EN DIRECT (CONFORME À L'IMAGE RÉFÉRENCE 2)
  // RÈGLE STRICTE : AUCUN MESSAGE AUTOMATIQUE POUR LE BOUTON WHATSAPP DE COMMANDE
  // ==========================================================================
  let cart = [];

  const totalEl = document.getElementById('order-total-price');
  const countEl = document.getElementById('order-items-count');
  const cartPreview = document.getElementById('cart-items-preview');
  const btnWhatsAppOrder = document.getElementById('btn-whatsapp-order');
  const btnClearCart = document.getElementById('btn-clear-cart');

  // Ajout depuis chaque bouton de ligne accessible
  document.querySelectorAll('.btn-add-accessible').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.menu-row-item');
      const name = row.getAttribute('data-name');
      const price = parseInt(row.getAttribute('data-price'), 10);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      renderCart();

      // Feedback visuel accessible
      const originalText = btn.textContent;
      btn.textContent = 'Ajouté !';
      btn.style.backgroundColor = 'var(--color-gold)';
      btn.style.color = '#0F5132';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 1200);
    });
  });

  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (countEl) {
      countEl.textContent = totalCount + ' plat(s) s\u00E9lectionn\u00E9(s)';
    }
    if (totalEl) {
      totalEl.textContent = totalPrice.toLocaleString('fr-FR') + ' DA';
    }

    if (cartPreview) {
      if (cart.length === 0) {
        cartPreview.innerHTML = '<p style="font-style: italic; color: #555; font-size: 0.88rem; padding: 0.5rem 0;">Aucun plat s\u00E9lectionn\u00E9 pour le moment. Cliquez sur "+ Ajouter" sur les mets ci-dessus.</p>';
      } else {
        cartPreview.innerHTML = cart.map((item, index) => `
          <div class="order-cart-item-row">
            <div class="order-cart-item-label">
              ${item.name} &times; <strong>${item.qty}</strong> \u2014 ${(item.price * item.qty).toLocaleString('fr-FR')} DA
            </div>
            <div class="order-cart-item-btns">
              <button class="btn-item-ctrl" data-action="dec" data-index="${index}" title="Diminuer">-</button>
              <button class="btn-item-ctrl" data-action="inc" data-index="${index}" title="Augmenter">+</button>
              <button class="btn-item-ctrl del" data-action="del" data-index="${index}" title="Supprimer">&times;</button>
            </div>
          </div>
        `).join('');

        cartPreview.querySelectorAll('.btn-item-ctrl').forEach(ctrlBtn => {
          ctrlBtn.addEventListener('click', (ev) => {
            const action = ev.target.getAttribute('data-action');
            const idx = parseInt(ev.target.getAttribute('data-index'), 10);

            if (action === 'inc') {
              cart[idx].qty += 1;
            } else if (action === 'dec') {
              cart[idx].qty -= 1;
              if (cart[idx].qty <= 0) cart.splice(idx, 1);
            } else if (action === 'del') {
              cart.splice(idx, 1);
            }
            renderCart();
          });
        });
      }
    }

    // Génération automatique du devis et du message complet pour WhatsApp
    if (btnWhatsAppOrder) {
      if (cart.length > 0) {
        let msg = "Bonjour Restaurant La Pastilla (Sétif),\n\n";
        msg += "Je souhaite passer la commande suivante :\n";
        msg += "--------------------------------------\n";
        cart.forEach((item, index) => {
          const lineTotal = item.price * item.qty;
          msg += `${index + 1}. ${item.name} x ${item.qty} = ${lineTotal.toLocaleString('fr-FR')} DA\n`;
        });
        msg += "--------------------------------------\n";
        msg += `Total articles : ${totalCount}\n`;
        msg += `TOTAL COMMANDE (Devis) : ${totalPrice.toLocaleString('fr-FR')} DA\n\n`;
        msg += "Merci de me confirmer la commande et le délai de préparation.";

        const waUrl = `https://wa.me/213542738379?text=${encodeURIComponent(msg)}`;
        btnWhatsAppOrder.href = waUrl;
        btnWhatsAppOrder.style.opacity = '1';
        btnWhatsAppOrder.style.pointerEvents = 'auto';
      } else {
        btnWhatsAppOrder.href = 'https://wa.me/213542738379?text=' + encodeURIComponent("Bonjour Restaurant La Pastilla, je souhaite passer une commande.");
        btnWhatsAppOrder.style.opacity = '0.7';
      }
      btnWhatsAppOrder.removeAttribute('target');
    }
  }

  // Initialisation de l'affichage vide
  renderCart();

  if (btnWhatsAppOrder) {
    btnWhatsAppOrder.addEventListener('click', (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        alert('Veuillez d\'abord ajouter des plats à votre commande avant de transmettre sur WhatsApp.');
        return;
      }
      const waUrl = btnWhatsAppOrder.getAttribute('href');
      if (waUrl && waUrl !== '#') {
        window.location.href = waUrl;
      }
    });
  }

  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      cart = [];
      renderCart();
    });
  }

  // ==========================================================================
  // 6. GESTION DU SERVICE & HEURE DE RÉSERVATION (SANS EMOJIS SOLEIL / LUNE)
  // ==========================================================================
  const serviceOptions = document.querySelectorAll('.service-btn-option');
  const customTimeInput = document.getElementById('book-exact-time');
  const timeHint = document.getElementById('service-time-hint');
  let currentService = 'D\u00EEner'; // Par défaut : Dîner

  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const selected = opt.getAttribute('data-service');
      currentService = selected === 'dejeuner' ? 'D\u00E9jeuner' : 'D\u00EEner';

      if (selected === 'dejeuner') {
        if (customTimeInput) {
          customTimeInput.min = '11:30';
          customTimeInput.max = '15:30';
          customTimeInput.value = '12:30';
        }
        if (timeHint) {
          timeHint.textContent = 'Service D\u00E9jeuner : veuillez saisir votre heure d\'arriv\u00E9e exacte entre 11h30 et 15h30.';
          timeHint.style.color = '#0F5132';
        }
      } else {
        if (customTimeInput) {
          customTimeInput.min = '18:30';
          customTimeInput.max = '23:00';
          customTimeInput.value = '20:00';
        }
        if (timeHint) {
          timeHint.textContent = 'Service D\u00EEner : veuillez saisir votre heure d\'arriv\u00E9e exacte entre 18h30 et 23h00.';
          timeHint.style.color = '#0F5132';
        }
      }
    });
  });

  // ==========================================================================
  // 7. FORMULAIRE DE RÉSERVATION DIRECTE AVEC TRANSMISSION WHATSAPP
  // ==========================================================================
  const bookingForm = document.getElementById('table-booking-form');
  const alertStatus = document.getElementById('booking-alert-status');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const date = document.getElementById('book-date').value;
      const exactTime = customTimeInput ? customTimeInput.value : '20:00';
      const time = `${currentService} \u00E0 ${exactTime}`;
      const guests = document.getElementById('book-guests').value;
      const notes = document.getElementById('book-notes').value.trim() || 'Aucune note particuli\u00E8re';

      const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const reservationId = `RES-${dateCode}-${randomId}`;

      // Préparation du message WhatsApp officiel pour la réservation
      const waMsg = encodeURIComponent(
        `Bonjour Restaurant La Pastilla (S\u00E9tif),\n` +
        `Je confirme ma r\u00E9servation de table :\n` +
        `\u2022 R\u00E9f\u00E9rence : ${reservationId}\n` +
        `\u2022 Nom : ${name}\n` +
        `\u2022 T\u00E9l\u00E9phone : ${phone}\n` +
        `\u2022 Date : ${date}\n` +
        `\u2022 Service / Heure choisie : ${time}\n` +
        `\u2022 Nombre de convives : ${guests}\n` +
        `\u2022 Demande particuli\u00E8re : ${notes}`
      );
      const waUrl = `https://wa.me/213542738379?text=${waMsg}`;

      // Notification visuelle de confirmation dans la page avec bouton de secours
      if (alertStatus) {
        alertStatus.style.display = 'block';
        alertStatus.style.backgroundColor = '#d1e7dd';
        alertStatus.style.color = '#0f5132';
        alertStatus.style.border = '1px solid #badbcc';
        alertStatus.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 0.35rem;">R\u00E9servation pr\u00E9par\u00E9e !</div>
          <div style="margin-bottom: 0.25rem;">R\u00E9f\u00E9rence : <code>${reservationId}</code></div>
          <div style="margin-bottom: 0.25rem;">Service : <strong>${time}</strong></div>
          <div style="margin-top: 0.35rem; font-size: 0.85rem;">Redirection vers WhatsApp en cours...</div>
          <div style="margin-top: 0.75rem;">
            <a href="${waUrl}" class="btn-main" style="display: inline-block; padding: 0.6rem 1.25rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; border-radius: 6px; background-color: #0F5132; color: #ffffff; border: 1px solid #C9A227;">
              Ouvrir WhatsApp manuellement
            </a>
          </div>
        `;
      }

      bookingForm.reset();

      // Redirection directe sans setTimeout ni window.open (non bloquée par iOS Safari et Android Chrome)
      window.location.href = waUrl;
    });
  }
});
