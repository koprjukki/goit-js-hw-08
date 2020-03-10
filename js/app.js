import gallery from "./gallery.js";
import refs from "./refs.js";

function markupGenerator({
    preview,
    original,
    description
}) {
    const createImages = `
    <li class="gallery__item">
    <a class="gallery__link" href="${original}">
      <img
        class="gallery__image"
        src="${preview}"
        data-source="${original}"
        alt="${description}"
      />
    </a>
    </li>`;

    return createImages;
}


function markupToHTML(parent, galleryItem) {
    parent.insertAdjacentHTML(
        "afterbegin",
        galleryItem.map(elem => markupGenerator(elem)).join(" ")
    );
}

markupToHTML(refs.gallery, gallery);


function openModal(e) {
    e.preventDefault();
    const {
        target
    } = e;
    if (e.target === e.currentTarget) {
        return;
    }
    refs.lightboxImage.setAttribute("src", target.dataset.source);
    refs.lightboxImage.setAttribute("alt", target.alt);
    refs.lightbox.classList.add("is-open");
}

function closeModal() {
    refs.lightbox.classList.remove("is-open");
    refs.imageLightbox.removeAttribute("src");
    refs.imageLightbox.removeAttribute("alt");
}


function closeModalByClick({
    target
}) {
    if (target.className !== "lightbox__content") {
        return;
    }
    closeModal();
}

function closeModalByEsc(e) {
    if (e.code !== "Escape") {
        return;
    }
    closeModal();
}

function nextAndPrevImg(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
        const currentValue = refs.lightboxImage;
        if (!currentValue.hasAttribute("src")) {
            return;
        }

        const {
            src
        } = currentValue;
        const arr = Array.from(gallery);
        let arrIndex = arr.findIndex(elem => elem.original === src);
        if (arrIndex !== -1) {
            if (e.keyCode === 39) arrIndex += 1;
            if (e.keyCode === 37) arrIndex -= 1;
            if (arrIndex <= 0) arrIndex = 0;
            if (arrIndex >= arr.length - 1) arrIndex = arr.length - 1;

            refs.lightboxImage.removeAttribute("src");
            refs.lightboxImage.removeAttribute("alt");

            const {
                original,
                description
            } = arr[arrIndex];

            refs.lightboxImage.setAttribute("src", original);
            refs.lightboxImage.setAttribute("alt", description);
        }
    }
}

refs.gallery.addEventListener("click", openModal);
refs.button.addEventListener("click", closeModal);
refs.lightbox.addEventListener("click", closeModalByClick);
window.document.addEventListener("keydown", closeModalByEsc);
window.document.addEventListener("keydown", nextAndPrevImg);