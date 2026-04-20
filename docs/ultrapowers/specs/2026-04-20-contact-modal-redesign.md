# Modal de Contacto Premium - Redesign

**Date:** 2026-04-20  
**Project:** Montana Realty Phase 1 - Contact Modal Improvement  
**Scope:** Redesign "Habla con un agente" modal for elegance, interactivity, and premium UX  
**Target User:** Luxury real estate buyers/investors seeking premium experience

---

## Executive Summary

Current modal is functional but feels like a generic form. New modal will feel **premium, elegant, and interactive** while maintaining simplicity. Three-step flow (Name+Email → Phone+Preference → Budget with slider) improves visual polish and captures investment intent.

**Key Improvements:**
- ✨ Minimalista design with generous spacing (premium aesthetic)
- 🎯 3-step progressive form with interactive slider for budget
- ✅ Smooth fade-in/fade-out transitions between steps
- 💬 Clear messaging ("Te contactaremos en menos de 24 horas")
- 📱 Full mobile optimization
- 🎚️ Interactive budget slider (user can drag to adjust)

---

## 1. Visual Design

### 1.1 Modal Container
- **Width:** 420px (desktop), 100% - 48px padding (mobile)
- **Background:** #ffffff (pure white)
- **Border Radius:** 8px
- **Box Shadow:** 0 20px 80px rgba(0,0,0,0.15) (subtle, elegant)
- **Padding:** 56px (desktop), 40px (mobile)
- **Position:** Center of viewport
- **Z-index:** 1001 (above all other elements)

### 1.2 Overlay
- **Background:** rgba(13,13,13,0.65) (semi-transparent black)
- **Backdrop Filter:** blur(2px) (optional, subtle)
- **Z-index:** 1000 (behind modal)

### 1.3 Close Button
- **Position:** Top-right corner (12px from corner)
- **Icon:** × (simple close symbol)
- **Size:** 32px × 32px
- **Color:** rgba(13,13,13,.45) (subtle)
- **Hover:** rgba(13,13,13,.8) (darker on hover)
- **Font Size:** 24px
- **Cursor:** pointer

---

## 2. Header Section

### 2.1 Headline
- **Text:** "Cuéntanos más"
- **Font:** Cormorant (serif)
- **Size:** 32px
- **Weight:** 300 (light, elegant)
- **Color:** #0d0d0d (black)
- **Line Height:** 1.2
- **Margin Bottom:** 8px

### 2.2 Subheadline
- **Text:** "Te contactaremos en menos de 24 horas"
- **Font:** Helvetica Neue (sans)
- **Size:** 13px
- **Weight:** 300 (light)
- **Color:** rgba(13,13,13,.55) (soft gray)
- **Letter Spacing:** 0.15em
- **Margin Bottom:** 40px

---

## 3. Step 1: Basic Contact Information

### 3.1 Animation
- **Entry:** Fade-in over 300ms (opacity: 0 → 1)
- **Exit:** Fade-out over 200ms when advancing to Step 2

### 3.2 Name Field
- **Label Text:** "NOMBRE" (uppercase)
- **Label Style:** 
  - Font Size: 8px
  - Letter Spacing: 0.35em
  - Color: rgba(13,13,13,.45)
  - Margin Bottom: 8px
  - Display: block
- **Input:**
  - Font: Helvetica Neue, 14px, weight 300
  - Color: #0d0d0d
  - Background: transparent
  - Border: none
  - Border Bottom: 1px solid rgba(13,13,13,.2)
  - Padding: 12px 0
  - Placeholder: "Juan García"
  - Placeholder Color: rgba(13,13,13,.25)
  - Margin Bottom: 32px
- **Focus State:**
  - Border Bottom: 1px solid #b91c1c (red)
  - Outline: none
  - Transition: border-color 0.2s

### 3.3 Email Field
- **Label Text:** "EMAIL" (uppercase)
- **Label Style:** Same as Name label
- **Input:**
  - Same styling as Name input
  - Type: email
  - Placeholder: "juan@example.com"
  - Margin Bottom: 40px

### 3.4 Continue Button
- **Text:** "Continuar"
- **Style:**
  - Background: #b91c1c (red)
  - Color: #ffffff (white)
  - Font: Helvetica Neue, 11px, weight 300
  - Letter Spacing: 0.25em
  - Text Transform: uppercase
  - Padding: 15px 40px
  - Border: none
  - Border Radius: 0px (sharp corners, modern)
  - Width: 100%
  - Cursor: pointer
  - Transition: opacity 0.2s
- **Hover State:**
  - Opacity: 0.85
- **Active/Click State:**
  - Opacity: 0.7
- **Disabled State:**
  - Opacity: 0.5
  - Cursor: not-allowed

---

## 4. Step 2: Contact Preference

### 4.1 Animation
- **Entry:** Fade-in over 300ms after Step 1 fades out
- **Delay:** 200ms (after Step 1 fade-out completes)

### 4.2 Phone Field
- **Label Text:** "TELÉFONO" (uppercase)
- **Label Style:** Same as Step 1 labels
- **Input:**
  - Font: Helvetica Neue, 14px, weight 300
  - Type: tel
  - Placeholder: "+52 81 1234 5678"
  - Border Bottom: 1px solid rgba(13,13,13,.2)
  - Padding: 12px 0
  - Margin Bottom: 32px
- **Focus State:** Border becomes red (#b91c1c)

### 4.3 Preference Section
- **Label Text:** "¿CÓMO PREFIERES QUE NOS CONTACTEMOS?" (uppercase)
- **Label Style:** Same as field labels, margin bottom 16px
- **Options (Radio Buttons):** 
  - WhatsApp
  - Email
  - Llamada telefónica
- **Radio Button Style (Custom):**
  - Size: 20px × 20px
  - Border: 2px solid rgba(13,13,13,.3)
  - Border Radius: 50% (circular)
  - Background: transparent
  - Margin Right: 12px
  - Margin Bottom: 16px (between options)
- **Radio Button Selected:**
  - Border Color: #b91c1c (red)
  - Inner Circle: 8px × 8px, background #b91c1c (red dot in center)
- **Label Text (next to radio):**
  - Font: Helvetica Neue, 13px, weight 300
  - Color: #0d0d0d
  - Cursor: pointer
  - User Select: none
- **Hover State:**
  - Label color becomes #0d0d0d (darker)
  - Radio border becomes #0d0d0d (slightly darker)
  - Cursor: pointer

### 4.4 Send Button (Step 2)
- **Text:** "Continuar" (same as Step 1, user advances to Step 3)
- **Style:** Same as Continue button (red #b91c1c)
- **Width:** 100%
- **Padding:** 15px 40px
- **Margin Top:** 40px

---

## 5. Step 3: Budget Preference (Interactive Slider)

### 5.1 Animation
- **Entry:** Fade-in over 300ms after Step 2 fades out
- **Delay:** 200ms (after Step 2 fade-out completes)

### 5.2 Budget Label
- **Label Text:** "RANGO DE PRESUPUESTO (MXN)" (uppercase)
- **Label Style:** Same as field labels
- **Margin Bottom:** 24px

### 5.3 Budget Slider
- **Type:** HTML5 range input with custom styling
- **Min Value:** 1,000,000 (1M pesos)
- **Max Value:** 50,000,000 (50M pesos)
- **Step:** 100,000 (100k increments)
- **Default Value:** 15,000,000 (15M pesos)
- **Width:** 100%
- **Height:** 6px (track)
- **Track Color:** rgba(13,13,13,.15) (light gray)
- **Filled Track (before thumb):** #b91c1c (red)
- **Thumb (slider knob):**
  - Width/Height: 24px × 24px
  - Background: #b91c1c (red)
  - Border: 2px solid #ffffff (white)
  - Border Radius: 50% (circle)
  - Shadow: 0 4px 12px rgba(185,28,28,.3) (subtle shadow)
  - Cursor: pointer
  - Transition: box-shadow 0.2s

### 5.4 Budget Display
- **Position:** Below slider, center-aligned
- **Format:** Displays selected value in pesos with formatting (e.g., "$15,000,000")
- **Font:** Cormorant serif, 28px, weight 300, color #0d0d0d
- **Updates:** Real-time as user drags slider
- **Margin Top:** 20px

### 5.5 Slider Hover/Focus State
- **Thumb Hover:** Box-shadow expands to 0 6px 16px rgba(185,28,28,.4)
- **Thumb Focus:** Box-shadow stays active, ring around thumb with red color
- **Track Hover:** Slightly darker shade, opacity increases

### 5.6 Budget Secondary Text (Optional)
- **Position:** Below displayed budget amount
- **Text:** e.g., "Buscas una propiedad en rango Alto" (dynamic based on value)
- **Font:** Helvetica Neue, 11px, weight 300, color rgba(13,13,13,.55)
- **Letter Spacing:** 0.15em

### 5.7 Send Button (Step 3)
- **Text:** "Enviar"
- **Style:** Same as Continue button (red #b91c1c)
- **Width:** 100%
- **Padding:** 15px 40px
- **Margin Top:** 40px

---

## 6. Success State

### 5.1 Display After Submission
- **Animation:** Current form fades out (200ms), success message fades in (300ms)
- **Content:**
  - Checkmark Icon: ✓ (serif font, 48px, red #b91c1c)
  - Message: "Gracias [Customer Name]."
  - Submessage: "Nos pondremos en contacto pronto."
  - Close Hint: "Cerrar en 5 segundos..." (optional countdown)

### 5.2 Success Message Styling
- **Headline:**
  - Font: Cormorant, 28px, weight 300
  - Color: #0d0d0d
  - Margin: 20px 0 10px 0
- **Subheadline:**
  - Font: Helvetica Neue, 13px, weight 300
  - Color: rgba(13,13,13,.55)

### 5.3 Auto-Close
- Modal closes automatically after 5 seconds (or user can click X)

---

## 6. Mobile Responsiveness

### 6.1 Modal Container
- **Width:** 100% - 48px (24px padding each side)
- **Max Width:** 100%
- **Padding:** 40px 24px

### 6.2 Typography Adjustments
- **Headline:** 24px (down from 32px)
- **Subheadline:** 12px
- **Labels:** 7px (slightly smaller)
- **Input Font:** 16px (prevents zoom on iOS focus)

### 6.3 Buttons
- **Height:** 56px (better touch target)
- **Padding:** 18px 24px
- **Width:** 100%

### 6.4 Input Fields
- **Padding Vertical:** 14px (larger for touch)
- **Padding Horizontal:** 0

### 6.5 Radio Buttons
- **Size:** 24px × 24px (larger for touch)
- **Margin Bottom:** 16px between options

### 6.6 Budget Slider
- **Track Height:** 8px (larger for touch)
- **Thumb Size:** 28px × 28px (larger for touch)
- **Margin Top/Bottom:** 20px (more breathing room)
- **Budget Display Font:** 24px (smaller for mobile space)

---

## 7. Interaction Flow

### 7.1 Modal Open
1. User clicks "Habla con un agente" button (sticky CTA)
2. Overlay appears with opacity animation (0 → 0.65) over 200ms
3. Modal appears with fade-in + subtle zoom (0.98 → 1.0) over 300ms
4. Focus automatically moves to Name input (optional, improves UX)

### 7.2 Step 1 Completion
1. User fills Name and Email
2. User clicks "Continuar"
3. Validation: Check name length > 2 chars, email is valid format
4. If invalid: Show red border on field + error message below input (3px below)
5. If valid: 
   - Step 1 content fades out (200ms)
   - 200ms delay
   - Step 2 content fades in (300ms)
   - Focus moves to Phone input

### 7.3 Step 2 Completion
1. User fills Phone (required) and selects preference (required radio button)
2. User clicks "Continuar"
3. Validation: Phone >= 10 chars (required), preference selected
4. If invalid: Show errors (red borders)
5. If valid: 
   - Step 2 content fades out (200ms)
   - 200ms delay
   - Step 3 content fades in (300ms)
   - Focus moves to budget slider

### 7.4 Step 3 Completion (Budget Slider)
1. User drags slider to select budget range (default 15M, range 1M-50M)
2. Budget amount updates in real-time as user drags
3. User clicks "Enviar" to submit form
4. Validation: All fields filled (name, email, phone, preference, budget)
5. If valid:
   - Submit to `/api/leads` with form data including budget
   - Show loading state on button ("Enviando...")
   - Step 3 content fades out (200ms)
   - Success state fades in (300ms) with checkmark animation
   - Auto-close after 5 seconds
6. If error: Show error message with retry button

### 7.5 Modal Close
- User clicks X button (top-right)
- Modal fades out (200ms)
- Overlay fades out (200ms)
- Focus returns to body

---

## 8. Data Structure (Form Submission)

```javascript
{
  name: "Juan García",
  email: "juan@example.com",
  phone: "+52 81 1234 5678",
  contactPreference: "whatsapp", // or "email", "telefono"
  budget: 15000000, // user-selected budget in pesos
  source: "sticky-cta", // identifies which button triggered
  timestamp: "2026-04-20T14:30:00Z"
}
```

---

## 9. Technical Implementation

### 9.1 Files to Modify
- `assets/js/form.js` — Update ProgressiveForm class to support new modal
- `assets/css/components.css` — Add new modal styles and animations
- `index (2).html` — Add modal HTML structure

### 9.2 Component Structure
```
ContactModal (new class)
├── open() — Shows modal with animation
├── close() — Hides modal with animation
├── showStep(1, 2, or 3) — Manages step transitions
├── validateStep(stepNum) — Validates current step before advancing
├── updateBudgetDisplay(value) — Updates budget amount in real-time
├── submit() — Validates all fields and sends to /api/leads
└── showSuccess() — Displays success state
```

### 9.3 Validation Rules
- **Name:** Min 2 chars, max 50 chars, no special chars
- **Email:** Valid email format (basic regex or HTML5 validation)
- **Phone:** Min 10 digits, allow +, spaces, dashes (REQUIRED)
- **Preference:** One radio button option selected (required)
- **Budget:** Numeric value between 1,000,000 and 50,000,000

### 9.4 Error Handling
- Show inline error messages below fields (red text, 11px)
- Keep button disabled until errors are resolved
- Network error: Show "Error al enviar. Intenta de nuevo." with retry button

---

## 10. Animation Details

### 10.1 Fade-In
```css
animation: fadeIn 0.3s ease-out forwards;

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 10.2 Fade-Out
```css
animation: fadeOut 0.2s ease-out forwards;

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

### 10.3 Zoom (for modal entry)
```css
animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

@keyframes zoomIn {
  from { 
    opacity: 0;
    transform: scale(0.98);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
```

### 10.4 Checkmark Animation (success)
```css
animation: checkmarkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

@keyframes checkmarkPop {
  0% { 
    opacity: 0;
    transform: scale(0.5) rotate(-45deg);
  }
  100% { 
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
```

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Form completion rate (both steps) | >45% |
| Average time to complete | <3 minutes |
| Mobile completion rate | >40% |
| Error rate on submission | <2% |
| User satisfaction (elegant experience) | Qualitative feedback |

---

## 12. Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile Safari (iOS): Full support (no zoom on input focus)
- Android Chrome: Full support

---

## 13. Accessibility

- Modal has `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label="Cerrar"`
- Form labels properly associated with inputs (for/id)
- Focus management: Focus moves to first input on modal open
- Keyboard support: Tab through fields, Enter submits, Escape closes
- Color contrast: All text meets WCAG AA standards

---

## 14. Testing Checklist

- [ ] Modal opens/closes smoothly with animations
- [ ] Step 1 validates name and email before advancing to Step 2
- [ ] Step 2 displays after Step 1 is complete
- [ ] Step 2 validates phone (required) and preference (required) before advancing to Step 3
- [ ] Step 3 displays budget slider after Step 2 is complete
- [ ] Budget slider responds to dragging and updates display in real-time
- [ ] Budget range correctly enforces min (1M) and max (50M) values
- [ ] Step 3 validates all fields before submission
- [ ] Form data is correctly posted to `/api/leads` with budget included
- [ ] Success message appears after submission with checkmark animation
- [ ] Modal auto-closes after 5 seconds in success state
- [ ] Mobile layout is responsive and touch-friendly on all steps
- [ ] Slider is draggable and responsive on mobile/touch devices
- [ ] Animations perform smoothly (no jank)
- [ ] Error messages display inline correctly on all steps
- [ ] Keyboard navigation works (Tab, Enter, Escape)

---

## 15. Future Enhancements (Phase 2)

- Add property pre-selection (if opened from property card)
- Show agent availability ("Agente disponible ahora")
- Real-time chat integration instead of form
- WhatsApp Web integration for instant contact

---

**Design Document Status:** Ready for Implementation  
**Date Prepared:** 2026-04-20  
**By:** Claude Haiku 4.5
