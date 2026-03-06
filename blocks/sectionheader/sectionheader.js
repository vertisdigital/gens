import Heading from '../../shared-components/Heading.js';
import stringToHTML from '../../shared-components/Utility.js';
import SVGIcon from '../../shared-components/SvgIcon.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
    const isAuthoring =
        !!block.querySelector('[data-aue-model], [data-aue-prop]');

    block.classList.add('section-header', 'block', 'container');
    block.classList.add('fade-item');
    const nested = block.children;

    const labelEl = nested[0]?.querySelector('p') || null;
    const titleEl = nested[1]?.querySelector('p') || null;
    const descCell = nested[2]?.children[0] || null;
    const descElements = descCell ? Array.from(descCell.querySelectorAll('p')) : [];

    const variant = block.classList.contains('horizontal') ? '' : 'vertical';
    if (variant) block.classList.add(variant);

    /* ---------- WRAPPER ---------- */
    const wrapper = document.createElement('div');
    wrapper.className = 'section-header-wrapper';

    const left = document.createElement('div');
    left.className = 'section-header-left';

    const right = document.createElement('div');
    right.className = 'section-header-right';

    /* ---------- LABEL ---------- */
    if (labelEl?.textContent?.trim()) {
        const label = document.createElement('p');
        label.className = 'section-header-label';
        label.textContent = labelEl.textContent.trim();
        moveInstrumentation(labelEl, label);
        left.appendChild(label);
    }

    /* ---------- TITLE ---------- */
    if (titleEl?.textContent?.trim()) {
        const headingHtml = Heading({
            level: 2,
            text: titleEl.textContent.trim(),
            className: 'section-header-title',
        });
        const heading = stringToHTML(headingHtml);
        moveInstrumentation(titleEl, heading);
        left.appendChild(heading);
    }

    /* ---------- DESCRIPTION ---------- */
    let descriptionNode = null;
    if (descElements.length > 0) {
        const desc = document.createElement('div');
        desc.className = 'section-header-description';

        descElements.forEach((p, index) => {
            const pElement = document.createElement('p');
            pElement.innerHTML = p.innerHTML;
            desc.appendChild(pElement);
            if (index === 0) {
                moveInstrumentation(p, desc);
            }
        });

        descriptionNode = desc;
    } else if (descCell && descCell.innerHTML.trim()) {
        const desc = document.createElement('div');
        desc.className = 'section-header-description';
        desc.innerHTML = descCell.innerHTML;
        moveInstrumentation(descCell, desc);
        descriptionNode = desc;
    }

    /* ---------- CTA ---------- */
    let ctaNode = null;

    const linkField = Array.from(
        block.querySelectorAll('[data-aue-model="linkField"], [data-gen-model="linkField"]')
    )[0] || null;

    if (linkField) {
        const linkDivs = Array.from(linkField.children);

        if (linkDivs.length === 3) {
            const [linkTextDiv, iconDiv, targetDiv] = linkDivs;
            const linkEl = linkTextDiv.querySelector('a');

            if (linkEl) {
                const href = linkEl.getAttribute('href');
                const title = linkEl.getAttribute('title');
                const iconName = iconDiv?.textContent?.trim()?.replace('-', '');
                const target = targetDiv?.textContent?.trim();

                const cta = document.createElement('a');
                cta.className = 'section-header-cta';

                cta.href = href || '#';

                if (target) {
                    cta.target = target;
                    if (target === '_blank') {
                        cta.rel = 'noopener noreferrer';
                    }
                }

                if (title && title !== '#' && title !== href) {
                    cta.setAttribute('title', title);
                } else if (titleEl && titleEl.textContent && titleEl.textContent.trim() !== '') {
                    cta.setAttribute('title', titleEl.textContent.trim());
                }


                if (iconName) {
                    const iconWrapper = document.createElement('span');
                    iconWrapper.className = 'section-header-cta-icon';

                    const svg = SVGIcon({ name: 'arrowright', size: 14 });
                    if (typeof svg === 'string') {
                        iconWrapper.innerHTML = svg;
                    } else {
                        iconWrapper.appendChild(svg);
                    }

                    cta.appendChild(iconWrapper);
                }

                moveInstrumentation(linkEl, cta);
                ctaNode = cta;
            }
        }

        if (!isAuthoring) {
            linkField.remove();
        }
    }

    /* ---------- ASSEMBLE ---------- */
    if (variant === '') {
        wrapper.appendChild(left);

        if (descriptionNode || ctaNode) {
            if (descriptionNode) right.appendChild(descriptionNode);
            if (ctaNode) right.appendChild(ctaNode);
            wrapper.appendChild(right);
        }
    } else {
        if (descriptionNode) left.appendChild(descriptionNode);
        wrapper.appendChild(left);
        if (ctaNode) wrapper.appendChild(ctaNode);
    }
    if (isAuthoring) {
        return;
    }

    block.innerHTML = '';
    block.appendChild(wrapper);
}
