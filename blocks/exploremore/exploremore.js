// Wrap CTA sections for styling
document.addEventListener('DOMContentLoaded', function() {
  const exploreMore = document.querySelector('.exploremore');
  if (!exploreMore) return;

  // Create CTA group container
  const ctaGroup = document.createElement('div');
  ctaGroup.className = 'cta-group';
  
  // Get title and move it before CTA group
  const title = exploreMore.querySelector('[data-aue-prop="title"]').parentNode;
  exploreMore.insertBefore(title, exploreMore.firstChild);

  // Process CTAs
  const firstCaption = exploreMore.querySelector('[data-aue-prop="firstCtaCaption"]');
  const secondCaption = exploreMore.querySelector('[data-aue-prop="secondCtaCaption"]');
  const firstLink = exploreMore.querySelector('a[href*="investor-relations"]');
  const secondLink = exploreMore.querySelector('a[href*="our-projects"]');

  if (firstCaption && firstLink) {
    const wrapper1 = document.createElement('div');
    wrapper1.className = 'cta-wrapper';
    const linkWrapper1 = document.createElement('div');
    linkWrapper1.className = 'link-wrapper';
    wrapper1.appendChild(firstCaption.parentNode);
    linkWrapper1.appendChild(firstLink);
    wrapper1.appendChild(linkWrapper1);
    ctaGroup.appendChild(wrapper1);
  }

  if (secondCaption && secondLink) {
    const wrapper2 = document.createElement('div');
    wrapper2.className = 'cta-wrapper';
    const linkWrapper2 = document.createElement('div');
    linkWrapper2.className = 'link-wrapper';
    wrapper2.appendChild(secondCaption.parentNode);
    linkWrapper2.appendChild(secondLink);
    wrapper2.appendChild(linkWrapper2);
    ctaGroup.appendChild(wrapper2);
  }

  // Add CTA group to explore more section
  exploreMore.appendChild(ctaGroup);

  // Remove original link elements
  firstLink?.parentNode?.remove();
  secondLink?.parentNode?.remove();
}); 