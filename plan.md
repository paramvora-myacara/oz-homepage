# OZ Listings Theme System Implementation Plan

## Project Overview
Implement a comprehensive dark/light theme system for the OZ Listings website with a professional color scheme using navy blue, gold, and white/black. The system should maintain all existing animations and functionality while introducing a sophisticated theme toggle system.

## Color Scheme Strategy

### Light Mode (Trust & Luxury)
- **Background**: Pure white (#ffffff)
- **Primary Text**: Deep navy blue (#1e293b)
- **Primary Actions**: Navy blue (#1e3a8a)
- **Luxury Accents**: Gold (#d97706 for subtle, #f59e0b for prominent)
- **Secondary Text**: Slate gray (#64748b)
- **Loading Elements**: Blue (#1e88e5)
- **Social Icons**: Blue (#1e88e5)

### Dark Mode (Sophisticated & Premium)
- **Background**: Rich black (#0a0a0a)
- **Primary Text**: Pure white (#ffffff)
- **Primary Actions**: Lighter navy (#3b82f6)
- **Luxury Accents**: Warm gold (#fbbf24)
- **Secondary Text**: Light gray (#e2e8f0)
- **Loading Elements**: Blue (#3b82f6)
- **Social Icons**: Blue (#3b82f6)

### System Mode
- Automatically detects user's OS preference and switches accordingly
- Updates dynamically when system preference changes

## Implementation Requirements

### Core Theme System
1. **Theme Context & Hook**
   - Create `ThemeContext` with React Context API
   - Implement `useTheme` hook for components
   - Support three modes: 'light', 'dark', 'system'
   - Persist theme preference in localStorage
   - System theme detection using `window.matchMedia('(prefers-color-scheme: dark)')`

2. **CSS Variables System**
   - Define all theme colors as CSS custom properties
   - Dynamic switching without page reload
   - Smooth transitions between themes

3. **Theme Toggle Component**
   - Single button cycling: light → dark → system
   - Use Lucide React icons: Sun (light), Moon (dark), Monitor (system)
   - Place to the right of "Speak to the Team" button in header
   - Gold accent ring when active

## Files to Edit

### 1. `/src/app/layout.js`
- Add theme provider wrapper
- Include theme script to prevent flash of unstyled content
- Add theme detection and CSS variables injection

### 2. `/src/app/globals.css`
- **CRITICAL**: Remove ALL gradients, use solid colors only
- Define CSS custom properties for all theme colors
- Add theme-aware color utilities
- Update existing color references to use CSS variables
- Primary headings: Navy (#1e293b in light, #ffffff in dark)
- Secondary text: Gray (maintain current gray values)
- Loading spinners: Blue (#1e88e5 in light, #3b82f6 in dark)
- Social icons: Blue (maintain current blue values)

### 3. `/src/app/components/ThemeLogo.js`
- Implement theme-aware logo switching
- Light theme: `/OZListings-Light.jpeg`
- Dark theme: `/OZListings-Dark.png`
- Add smooth transition animations

### 4. `/src/app/components/Header.js`
- Add theme toggle button to the right of "Speak to the Team"
- Update component to be theme-aware
- Maintain exact same layout and positioning

### 5. `/src/app/components/CTAButton.js`
- **CRITICAL**: Remove all gradients, use solid colors
- Update color values to use CSS variables
- Implement theme-aware hover states
- Gold primary buttons, navy secondary buttons
- Change shimmer effects from white to gold

### 6. `/src/app/components/OZMapVisualization.js`
- **CRITICAL**: Change OZ zones from blue to gold
- Update tooltip styling for dark mode
- Maintain all existing functionality and animations
- Use gold colors: #d97706 (light mode), #fbbf24 (dark mode)

### 7. `/src/app/components/HorizontalScrollSlideshow.js`
- **CRITICAL**: Remove all gradients, use solid colors
- Update progress bars to gold
- Update button colors to navy/gold scheme
- Maintain all existing GSAP animations

### 8. `/src/app/components/OZListingsCarousel.js`
- **CRITICAL**: Remove all gradients, use solid colors
- Update hover states and button colors
- Change primary buttons to gold
- Update navigation buttons to theme-aware colors

### 9. `/src/app/components/OZListingsFooter.js`
- **CRITICAL**: Remove all gradients, use solid colors
- Update background colors for dark mode
- Change primary CTA to gold
- Social icons remain blue
- Update all button styling to solid colors

### 10. `/src/app/components/ScrollDrivenPinnedText.js`
- **CRITICAL**: Remove gradient text, use solid navy
- Update background colors for dark mode
- Primary headings: Navy in light mode, white in dark mode
- Progress indicators: Gold instead of blue

### 11. `/src/app/components/ScrollDrivenTextAnimation.js`
- Update text colors to be theme-aware
- Primary text: Navy in light mode, white in dark mode
- Background: Theme-aware colors

### 12. `/src/app/components/ScrollTriggeredSlideshow.js`
- **CRITICAL**: Remove all gradients, use solid colors
- Update progress indicators to gold
- Update button colors to navy/gold scheme
- Maintain all existing animations

### 13. `/src/app/page.js`
- Update hero section colors
- Change button colors to navy/gold scheme
- **CRITICAL**: Remove all gradients, use solid colors
- Update all text colors to navy for headings, gray for secondary

## New Files to Create

### 1. `/src/app/components/ThemeToggle.js`
```javascript
// Theme toggle button component
// Single button cycling through light → dark → system
// Uses Lucide React icons
// Gold accent ring when active
```

### 2. `/src/app/contexts/ThemeContext.js`
```javascript
// Theme context provider
// Manages theme state and persistence
// Handles system preference detection
// Provides theme utilities
```

### 3. `/src/app/hooks/useTheme.js`
```javascript
// Custom hook for theme functionality
// Returns current theme, toggle function, and theme utilities
// Handles localStorage persistence
// Manages system preference monitoring
```

## Dependencies to Add

### Required NPM Packages
```bash
npm install lucide-react
```

## Implementation Guidelines

### 1. **No Gradients Rule**
- **CRITICAL**: Remove ALL gradient backgrounds, borders, and text
- Replace with solid colors only
- Examples to change:
  - `bg-gradient-to-r from-[#1e88e5] to-[#42a5f5]` → `bg-[#1e88e5]`
  - Gradient text effects → solid navy text
  - Gradient buttons → solid gold buttons

### 2. **Color Usage Strategy**
- **Primary CTAs**: Gold (`#d97706` light, `#fbbf24` dark)
- **Secondary CTAs**: Navy (`#1e293b` light, `#3b82f6` dark)
- **Primary Headings**: Navy (`#1e293b` light, `#ffffff` dark)
- **Secondary Text**: Gray (maintain current values)
- **Interactive Elements**: Gold accents, blue loading states
- **Social Icons**: Blue (maintain current values)

### 3. **Theme Toggle Placement**
- Exact position: Right of "Speak to the Team" button in header
- Same visual hierarchy as other header buttons
- Smooth icon transitions
- Accessible keyboard navigation

### 4. **CSS Variables Implementation**
```css
:root {
  --color-background: #ffffff;
  --color-foreground: #1e293b;
  --color-primary: #d97706;
  --color-secondary: #1e293b;
  --color-accent: #f59e0b;
  --color-muted: #64748b;
  --color-blue: #1e88e5;
}

[data-theme="dark"] {
  --color-background: #0a0a0a;
  --color-foreground: #ffffff;
  --color-primary: #fbbf24;
  --color-secondary: #3b82f6;
  --color-accent: #fbbf24;
  --color-muted: #e2e8f0;
  --color-blue: #3b82f6;
}
```

### 5. **Animation Preservation**
- **CRITICAL**: All existing animations must remain identical
- GSAP scroll triggers: No changes
- Framer Motion effects: No changes
- Hover states: Update colors only
- Transition timings: Keep exact same values

### 6. **Logo System**
- Light mode: Use `/OZListings-Light.jpeg`
- Dark mode: Use `/OZListings-Dark.png`
- Smooth transition between logos
- Maintain exact same dimensions and positioning

### 7. **Map Visualization Updates**
- **CRITICAL**: OZ zones must be gold, not blue
- Light mode: Gold zones (`#d97706`) with subtle glow
- Dark mode: Gold zones (`#fbbf24`) with enhanced glow
- Maintain all existing interactivity and animations

### 8. **Accessibility Requirements**
- Ensure all color combinations meet WCAG AA standards
- Focus states: Gold focus rings
- Keyboard navigation: Full support for theme toggle
- Screen reader: Proper ARIA labels for theme state

### 9. **Performance Considerations**
- CSS variables for instant theme switching
- Prevent layout shifts during theme changes
- Optimize for minimal JavaScript execution
- Use CSS-only transitions where possible

### 10. **Testing Requirements**
- Test theme persistence across page reloads
- Verify system theme detection and automatic switching
- Test all interactive elements in both themes
- Ensure no flash of unstyled content
- Verify all animations work identically in both themes

## Quality Assurance Checklist

### Visual Design
- [ ] All gradients removed and replaced with solid colors
- [ ] Primary headings use navy (#1e293b) in light mode
- [ ] Secondary text remains gray
- [ ] Gold used prominently for primary CTAs
- [ ] Loading spinners are blue
- [ ] Social icons remain blue
- [ ] OZ map zones are gold instead of blue

### Functionality
- [ ] Theme toggle cycles correctly: light → dark → system
- [ ] System theme detection works automatically
- [ ] Theme preference persists across sessions
- [ ] All animations function identically in both themes
- [ ] Logo switches correctly between themes
- [ ] No layout shifts during theme changes

### Code Quality
- [ ] DRY principle followed (no repeated color values)
- [ ] CSS variables used consistently
- [ ] Component structure maintained
- [ ] Performance optimized
- [ ] TypeScript types added where applicable
- [ ] Error handling for theme system failures

## Implementation Order

1. **Foundation** (Priority 1)
   - Theme context and provider
   - CSS variables system
   - Theme toggle component

2. **Core Components** (Priority 2)
   - Logo system
   - Header updates
   - CTA buttons

3. **Layout Components** (Priority 3)
   - Hero section
   - Footer
   - Map visualization

4. **Content Components** (Priority 4)
   - Slideshow components
   - Scroll-driven animations
   - Carousel components

5. **Polish & Testing** (Priority 5)
   - Accessibility improvements
   - Performance optimization
   - Cross-browser testing

## Success Criteria

1. **Theme System**: Seamless switching between light, dark, and system modes
2. **Color Scheme**: Professional navy/gold/white color palette with no gradients
3. **Animation Preservation**: All existing animations work identically
4. **Logo System**: Automatic logo switching based on theme
5. **Map Enhancement**: Gold OZ zones instead of blue
6. **Accessibility**: WCAG AA compliance maintained
7. **Performance**: No performance degradation
8. **User Experience**: Smooth, professional, luxury feel that represents trust and sophistication

## Brand Representation Goals

- **Trust**: Navy blue conveys stability and professionalism
- **Luxury**: Gold accents provide premium feel
- **Sophistication**: Dark mode with refined color palette
- **Accessibility**: Clear contrast and readable typography
- **Consistency**: Uniform color usage across all components 