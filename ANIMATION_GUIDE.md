# Animation System Guide

## Overview
This project uses a custom scroll-triggered animation system based on the Intersection Observer API. Animations are triggered when elements enter the viewport.

## Usage

### Basic Usage
Add `data-animation` attribute with an animation class name to any element:

```html
<div data-animation="fade-in">
  This will fade in when scrolled into view
</div>
```

### With Delay
Add `data-animation-delay` for a delay in milliseconds:

```html
<div data-animation="fade-in-up" data-animation-delay="200">
  This will fade in up after 200ms delay
</div>
```

### Custom Duration
Add `data-animation-duration` for custom animation duration:

```html
<div data-animation="fade-in" data-animation-duration="1000">
  This will fade in over 1 second
</div>
```

## Available Animation Classes

### Fade Animations
- `fade-in` - Simple fade in
- `fade-in-up` - Fade in while moving up
- `fade-in-down` - Fade in while moving down
- `fade-in-left` - Fade in while moving from left
- `fade-in-right` - Fade in while moving from right

### Scale Animations
- `scale-in` - Scale from 0.9 to 1.0
- `zoom-in` - Scale from 0.8 to 1.0

### Slide Animations
- `slide-in-up` - Slide up from 50px below

## Stagger Animations

For animating children elements with a stagger effect:

```html
<div data-animation-stagger="fade-in-up">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

Each child will animate with a 100ms delay between them.

## Examples

### Project Cards Component
```html
<section class="projectcards" data-animation="fade-in-up" data-animation-delay="100">
  <!-- content -->
</section>
```

### Listing Component
```html
<div class="listing" data-animation="fade-in-left" data-animation-delay="200">
  <!-- content -->
</div>
```

### Feature Cards with Stagger
```html
<div class="feature-row" data-animation-stagger="fade-in-up">
  <div class="feature-item">Card 1</div>
  <div class="feature-item">Card 2</div>
  <div class="feature-item">Card 3</div>
</div>
```

## Adding Custom Animations

To add custom animations, edit `styles/animations.css`:

```css
/* Custom Animation */
[data-animation="custom-name"].animate {
  animation: customAnimation 0.6s ease-out forwards;
}

@keyframes customAnimation {
  from {
    opacity: 0;
    transform: translateY(20px) rotate(5deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}
```

## Accessibility

The animation system respects `prefers-reduced-motion` media query. Users with motion sensitivity preferences will see content without animations.

## Performance

- Uses Intersection Observer API (native browser API, no dependencies)
- Animations only trigger once when element enters viewport
- Lightweight and performant
- No external libraries required

## Integration with Components

You can add animation attributes directly in your component JavaScript:

```javascript
// In projectcards.js
block.setAttribute('data-animation', 'fade-in-up');
block.setAttribute('data-animation-delay', '100');
```

Or add them in the HTML/block definition for AEM authoring.
