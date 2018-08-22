var ModalEffects = (function () {

	function init() {

		var overlay = document.querySelector('.md-overlay');

		[].slice.call(document.querySelectorAll('.md-trigger')).forEach(function (el, i) {

			var modal = document.querySelector('#' + el.getAttribute('data-modal')),
				close = modal.querySelector('.md-close');

			function removeModal(hasPerspective) {
				classie.remove(modal, 'md-show');
			}

			function removeModalHandler() {
				removeModal(classie.has(el, 'md-setperspective'));
			}

			el.addEventListener('click', function (ev) {
				classie.add(modal, 'md-show');
				overlay.removeEventListener('click', removeModalHandler);
				overlay.addEventListener('click', removeModalHandler);
			});

			close.addEventListener('click', function (ev) {
				ev.stopPropagation();
				removeModalHandler();
			});

		});

	}

	init();

})();