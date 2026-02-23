import Heading from '../../shared-components/Heading.js';
import stringToHTML from '../../shared-components/Utility.js';
import { getIcon } from '../../shared-components/icons/index.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
    block.classList.add('fade-item');
    const rows = [...block.children];

    if (rows.length < 2) return;

    const titleEl = rows[0]?.querySelector('p');
    const descEl = rows[1]?.querySelector('p');
    const accordionRows = rows.slice(2);

    const container = document.createElement('div');
    container.className = 'accordion-container container';

    /* ---------- HEADER BLOCK ---------- */
    const headerBlock = document.createElement('div');
    headerBlock.className = 'accordion-header-block';

    if (titleEl?.textContent?.trim()) {
        const headingHtml = Heading({
            level: 2,
            text: titleEl.textContent.trim(),
            className: 'accordion-title',
        });
        const heading = stringToHTML(headingHtml);
        moveInstrumentation(titleEl, heading);
        headerBlock.appendChild(heading);
    }

    if (descEl?.innerHTML?.trim()) {
        const desc = document.createElement('div');
        desc.className = 'accordion-description';
        desc.innerHTML = descEl.innerHTML;
        moveInstrumentation(descEl, desc);
        headerBlock.appendChild(desc);
    }

    container.appendChild(headerBlock);

    /* ---------- ACCORDION BLOCK ---------- */
    const accordionBlock = document.createElement('div');
    accordionBlock.className = 'accordion-block';
    accordionBlock.setAttribute('role', 'region');
    accordionBlock.setAttribute('aria-label', 'Accordion');

    accordionRows.forEach((row, index) => {
        const [titleCell, contentCell] = row.children;
        const itemTitle = titleCell?.querySelector('p')?.textContent?.trim();
        const itemContent = contentCell?.innerHTML?.trim();

        if (!itemTitle) return;

        const itemId = `accordion-item-${index}`;
        const panelId = `accordion-panel-${index}`;
        const isExpanded = index === 0;

        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.setAttribute('data-accordion-item', '');

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'accordion-trigger';
        button.id = itemId;
        button.setAttribute('aria-expanded', isExpanded);
        button.setAttribute('aria-controls', panelId);
        button.setAttribute('aria-disabled', 'false');

        const titleSpan = document.createElement('span');
        titleSpan.className = 'accordion-trigger-text';
        titleSpan.textContent = itemTitle;
        moveInstrumentation(titleCell?.querySelector('p'), titleSpan);

        const iconSpan = document.createElement('span');
        iconSpan.className = 'accordion-icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.innerHTML = getIcon('chevronDown') || '';

        button.appendChild(titleSpan);
        button.appendChild(iconSpan);
        item.appendChild(button);

        const panel = document.createElement('div');
        panel.id = panelId;
        panel.className = 'accordion-panel';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', itemId);
        panel.hidden = !isExpanded;

        if (itemContent) {
            const panelInner = document.createElement('div');
            panelInner.className = 'accordion-panel-content';
            panelInner.innerHTML = itemContent;
            moveInstrumentation(contentCell, panelInner);
            panel.appendChild(panelInner);
        }

        item.appendChild(panel);
        accordionBlock.appendChild(item);
    });

    accordionBlock.addEventListener('click', (e) => {
        const trigger = e.target.closest('.accordion-trigger');
        if (!trigger) return;

        const item = trigger.closest('.accordion-item');
        const panel = item?.querySelector('.accordion-panel');
        const isCurrentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

        if (!isCurrentlyExpanded) {
            // Collapse all other accordion items (only one active at a time)
            accordionBlock.querySelectorAll('.accordion-item').forEach((otherItem) => {
                if (otherItem !== item) {
                    const otherTrigger = otherItem.querySelector('.accordion-trigger');
                    const otherPanel = otherItem.querySelector('.accordion-panel');
                    if (otherTrigger && otherPanel) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        otherPanel.hidden = true;
                    }
                }
            });
        }

        trigger.setAttribute('aria-expanded', !isCurrentlyExpanded);
        panel.hidden = isCurrentlyExpanded;
    });

    accordionBlock.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const trigger = e.target.closest('.accordion-trigger');
        if (trigger) {
            e.preventDefault();
            trigger.click();
        }
    });

    container.appendChild(accordionBlock);

    block.innerHTML = '';
    block.appendChild(container);
}

