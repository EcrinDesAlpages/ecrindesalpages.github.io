// Ecrin des Alpages — scripts maison (carrousels + filtre planning)
(function () {

	// Carrousels photo (défilement cyclique via les flèches)
	document.querySelectorAll('.edg-carousel-wrap').forEach(function (wrap) {
		var track = wrap.querySelector('.edg-carousel');
		if (!track) return;
		var prev = wrap.querySelector('.edg-carousel-btn.prev');
		var next = wrap.querySelector('.edg-carousel-btn.next');
		var step = function () {
			var slide = track.querySelector('.edg-carousel-slide');
			return slide ? slide.getBoundingClientRect().width + 14 : 300;
		};
		if (prev) prev.addEventListener('click', function () {
			if (track.scrollLeft <= 5) {
				track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: 'smooth' });
			} else {
				track.scrollBy({ left: -step(), behavior: 'smooth' });
			}
		});
		if (next) next.addEventListener('click', function () {
			var maxScroll = track.scrollWidth - track.clientWidth;
			if (track.scrollLeft >= maxScroll - 5) {
				track.scrollTo({ left: 0, behavior: 'smooth' });
			} else {
				track.scrollBy({ left: step(), behavior: 'smooth' });
			}
		});
	});

	// Lightbox (agrandissement au clic) avec navigation façon carrousel :
	// les photos d'un même carrousel ou d'une même galerie restent
	// parcourables (flèches / clavier) une fois agrandies.
	var lbGroupEls = document.querySelectorAll('.edg-carousel, .edg-gallery');
	if (lbGroupEls.length) {
		var lbOverlay = document.createElement('div');
		lbOverlay.className = 'edg-lightbox';
		lbOverlay.innerHTML =
			'<button type="button" class="edg-lightbox-close" aria-label="Fermer">&times;</button>' +
			'<button type="button" class="edg-lightbox-nav prev" aria-label="Précédent">‹</button>' +
			'<img class="edg-lightbox-img" src="" alt="" />' +
			'<button type="button" class="edg-lightbox-nav next" aria-label="Suivant">›</button>';
		document.body.appendChild(lbOverlay);

		var lbImg = lbOverlay.querySelector('.edg-lightbox-img');
		var lbClose = lbOverlay.querySelector('.edg-lightbox-close');
		var lbPrev = lbOverlay.querySelector('.edg-lightbox-nav.prev');
		var lbNext = lbOverlay.querySelector('.edg-lightbox-nav.next');

		var lbGroup = [];
		var lbIndex = 0;

		var showCurrent = function () {
			var item = lbGroup[lbIndex];
			if (!item) return;
			lbImg.setAttribute('src', item.src);
			lbImg.setAttribute('alt', item.alt || '');
			var multi = lbGroup.length > 1;
			lbPrev.style.display = multi ? '' : 'none';
			lbNext.style.display = multi ? '' : 'none';
		};
		var openLightbox = function (group, index) {
			lbGroup = group;
			lbIndex = index;
			showCurrent();
			lbOverlay.classList.add('is-visible');
			document.body.classList.add('edg-lightbox-open');
		};
		var closeLightbox = function () {
			lbOverlay.classList.remove('is-visible');
			document.body.classList.remove('edg-lightbox-open');
			lbImg.setAttribute('src', '');
		};
		var showPrev = function () {
			if (lbGroup.length < 2) return;
			lbIndex = (lbIndex - 1 + lbGroup.length) % lbGroup.length;
			showCurrent();
		};
		var showNext = function () {
			if (lbGroup.length < 2) return;
			lbIndex = (lbIndex + 1) % lbGroup.length;
			showCurrent();
		};

		lbGroupEls.forEach(function (container) {
			var imgs = Array.prototype.slice.call(container.querySelectorAll('img'));
			if (!imgs.length) return;
			var group = imgs.map(function (img) {
				return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
			});
			imgs.forEach(function (img, idx) {
				img.classList.add('edg-lightbox-target');
				img.addEventListener('click', function () {
					openLightbox(group, idx);
				});
			});
		});

		lbOverlay.addEventListener('click', function (e) {
			if (e.target === lbOverlay) closeLightbox();
		});
		lbClose.addEventListener('click', closeLightbox);
		lbPrev.addEventListener('click', function (e) { e.stopPropagation(); showPrev(); });
		lbNext.addEventListener('click', function (e) { e.stopPropagation(); showNext(); });
		document.addEventListener('keydown', function (e) {
			if (!lbOverlay.classList.contains('is-visible')) return;
			if (e.key === 'Escape') closeLightbox();
			else if (e.key === 'ArrowLeft') showPrev();
			else if (e.key === 'ArrowRight') showNext();
		});
	}

	// Filtre planning (Toutes / Disponibles)
	var buttons = document.querySelectorAll('.edg-filter-btn');
	var cards = document.querySelectorAll('.edg-chip');
	buttons.forEach(function (btn) {
		btn.addEventListener('click', function () {
			buttons.forEach(function (b) { b.classList.remove('is-active'); });
			btn.classList.add('is-active');
			var filter = btn.getAttribute('data-filter');
			cards.forEach(function (card) {
				if (filter === 'all' || card.getAttribute('data-status') === filter) {
					card.style.display = '';
				} else {
					card.style.display = 'none';
				}
			});
		});
	});

})();
