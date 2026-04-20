# Montana Realty: Lead Generation Optimization - Phase 1 Design

**Date:** 2026-04-20  
**Project:** Montana Realty - San Pedro Garza García  
**Scope:** Homepage optimization for lead capture and conversion  
**Target:** Premium real estate buyers & investors  
**Success Metric:** Lead capture + conversion to agent contact

---

## 1. Executive Summary

Montana Realty's current website is informative but lacks lead generation mechanisms and user interactivity. Phase 1 transforms the site into a conversion-focused experience that captures high-intent buyers while maintaining premium aesthetics.

**Key Changes:**
- Add property comparison tool (interactive engagement)
- Implement omnichannel CTAs (multiple touch points)
- Create optimized lead capture flow (progressive disclosure)
- Enable instant agent notifications (sales team activation)

**Expected Outcome:** 
- Higher lead capture rate
- Better user engagement time
- Clear lead qualification (buyer interest signals)
- Streamlined agent workflow

---

## 2. Problem Statement

**Current State:**
- Previous website was purely informational (no lead magnets)
- No user interaction mechanisms
- No way to capture buyer contact information at scale
- Agents couldn't understand buyer intent level
- High traffic but low conversions

**Desired State:**
- Premium experience with interactive property exploration
- Multiple opportunities to contact agents throughout user journey
- Clear capture of interested buyers' contact info
- Agents notified instantly of new leads with intent signals

---

## 3. Architecture & User Flow

### 3.1 Three-Column Conversion Model

```
[DISCOVERY]              [INTERACTION]           [ACTION]
Hero                  →  Comparator          →  Lead Forms
Property Gallery      →  Property Showcase   →  CTAs
                      →  Investment Analysis →  Agent Contact
```

### 3.2 User Journey Map

```
Landing
  ↓
[Hero] "Creando tus sueños inmobiliarios"
  ↓
[Browse Properties] Sticky CTA: "Habla con un agente" (available)
  ↓
[Select Properties] "Comparar" button on 2-3 properties
  ↓
[Comparison View] Side-by-side analysis with investment metrics
  ↓
[Lead Capture] "Ver análisis con un agente" → Form modal
  ↓
[Confirmation] "Un agente te contactará en < 24h"
  ↓
[Backend] → Agent notification + WhatsApp/Email follow-up
```

---

## 4. Component Specifications

### 4.1 Sticky CTA Floating Button

**Location:** Bottom-right corner, always visible (except hero section)  
**Design:** 
- Small circular button (60px diameter)
- Icon + text: "Habla con un agente"
- Subtle animation (pulse on page load)
- Elegant, non-aggressive

**Behavior:**
- Clicking opens options:
  - Chat widget
  - WhatsApp direct link
  - Schedule consultation form

**Mobile:** Converts to large sticky button (full width, bottom)

**Code Location:** Will be a reusable component with animation

---

### 4.2 Property Comparison Tool

**Purpose:** Interactive engagement + lead qualification  
**Interaction:**
1. User browses property gallery
2. Clicks "Comparar" button on 2-3 properties
3. Comparison badge appears ("Comparando: 3 propiedades")
4. User clicks badge or CTA to open comparison modal

**Comparison Modal Content:**
| Feature | Property A | Property B | Property C |
|---------|-----------|-----------|-----------|
| Precio | $12.5M | $8.9M | $18.2M |
| Área total | 620 m² | 280 m² | 850 m² |
| Ubicación | Valle Oriente | Del Valle | San Agustín |
| Recámaras | 5+estudio | 3 | 6 |
| Baños | 6 | 3 | 7 |
| ROI Estimado | 4.2% | 5.1% | 3.8% |
| Potencial Revalorización | Alto | Muy Alto | Alto |

**CTA at Bottom:**
"Obtener análisis detallado con un experto" → Opens lead form with comparison pre-filled

**Mobile:** Full-screen swipeable comparison cards

---

### 4.3 Contextual CTAs

**Placement 1: Property Gallery Card**
- Original: Just image + basic info
- New: Add "Comparar" button + "Solicitar visita" link
- Hover effect: Show quick comparison option

**Placement 2: Property Showcase/Detail Page**
- Original: "Solicitar visita" button
- New: Add "Me interesa esta propiedad" quick form
- Pre-fill with property data if lead already exists

**Placement 3: Investment Section (Map Strip)**
- Add micro-CTA: "¿Dudas sobre esta zona? Habla con nosotros"
- Redirects to WhatsApp with pre-written message

**Placement 4: About Section**
- Add: "Conocer nuestro expertise" CTA
- Opens consultation scheduling

**Placement 5: Footer**
- Add secondary CTA: "Cotizar mi propiedad" (new lead type)

---

### 4.4 Lead Form (Optimized)

**Design Principle:** Progressive disclosure (ask minimum, then expand)

**Step 1 - Initial Capture (Modal Opens):**
```
Nombre: [text input]
Email: [email input]

[Continuar]
```

**Step 2 - Qualification (After initial info):**
```
Teléfono: [tel input - optional]
¿Cómo prefieres que te contactemos?
  ☐ Email
  ☐ WhatsApp
  ☐ Teléfono

[Agendar consulta]
```

**Step 3 - Consultation (If selected):**
```
¿Qué te interesa?
- Comprar propiedad
- Inversión inmobiliaria
- Vender propiedad
- Consulta de mercado

Presupuesto (MXN):
- Menos de $3M
- $3M - $8M
- $8M - $15M
- $15M+

Zona de interés: [multi-select]

[Agendar → Calendar widget]
```

**Design:**
- Elegant modal (not too wide on desktop, full-screen on mobile)
- Minimal design (matches site aesthetic)
- Clear progress indicator
- Option to skip optional fields

---

### 4.5 Lead Notification System (Backend)

**Trigger:** Every form submission  
**Notification includes:**
- Lead name, email, phone
- Property(ies) of interest
- Comparison data (if used comparator)
- Intent level (browsing vs. ready to buy)
- Timestamp

**Delivery Methods:**
- Admin dashboard (live feed of leads)
- Email notification to assigned agent
- WhatsApp notification (optional)
- CRM integration (if applicable)

**Agent Workflow:**
1. Lead comes in
2. Agent sees lead intent signals (property viewed, comparison made, consultation requested)
3. Agent contacts via preferred channel (WhatsApp/Email/Phone)
4. Follow-up tracking in dashboard

---

## 5. Changes to Existing Sections

### 5.1 Hero Section
**Current:** "Creando tus sueños inmobiliarios" + logo (centered)  
**Change:** None. Keep as-is, it's already optimized.

### 5.2 Property Gallery
**Current:** 3-column grid with property cards  
**Changes:**
- Add "Comparar" button overlay (appears on hover)
- Show comparison badge: "Comparando: 2/3" if properties selected
- Highlight border on selected properties

### 5.3 Property Showcase/Detail
**Current:** Image gallery + specs + contact buttons  
**Changes:**
- Sticky CTA: "Me interesa" quick form
- Property pre-filled in lead form
- Add "View similar properties" section

### 5.4 Lead Form (Current)
**Current:** Long form in dedicated section  
**Changes:**
- Convert to modal-based progressive form
- Use for multiple CTAs (not just one section)
- Shorter, snappier questions
- Better mobile experience

### 5.5 Contact Section
**Current:** Contact info + message form  
**Changes:**
- Add WhatsApp direct link (prominent)
- Simplify form (remove redundant fields)
- Add "Ask about this property" option

---

## 6. Technical Implementation Notes

### 6.1 Frontend Components to Build
- `StickyContactButton` — Floating CTA with animation
- `ComparisonTool` — Select, compare, analyze properties
- `ComparisonModal` — Display comparison data
- `LeadFormModal` — Multi-step form with validation
- `PropertyCard` — Add comparison UI
- `ComparisonBadge` — Show selected count
- `CTAButton` — Flexible CTA with multiple actions

### 6.2 Backend Integrations Needed
- Lead capture endpoint (store form submissions)
- Property data API (populate comparison data)
- Notification service (email/WhatsApp)
- Admin dashboard (view leads)
- CRM integration (optional but recommended)

### 6.3 Data Flow
```
User fills form
    ↓
POST /api/leads (capture)
    ↓
Store in DB + create notification
    ↓
Send email to agent team
    ↓
Optional: Send WhatsApp notification
    ↓
Display lead in admin dashboard
    ↓
Agent follows up
```

---

## 7. Design System Updates

### 7.1 New Color Usage
- CTA buttons: Red (#b91c1c) on white backgrounds
- Hover states: Slight opacity increase
- Success states: Green confirmation

### 7.2 Typography
- Form labels: Eye class (small, uppercase, gray)
- Form inputs: Match site sans-serif, proper contrast
- Modal titles: Use h3 style

### 7.3 Spacing
- Modal padding: 40-56px (consistent with site)
- Form field spacing: 24px between fields
- Button padding: 15px vertical, 40px horizontal

---

## 8. Mobile Optimization

### 8.1 Sticky CTA
**Desktop:** 60px circular button, bottom-right  
**Mobile:** Full-width sticky button at bottom, 56px height

### 8.2 Comparison Tool
**Desktop:** Modal, side-by-side layout  
**Mobile:** Full-screen, vertical card layout, swipeable

### 8.3 Forms
**Desktop:** Modal with reasonable width  
**Mobile:** Full-screen, larger touch targets, auto-focus inputs

### 8.4 Property Gallery
**Desktop:** 3-column grid  
**Mobile:** 2-column grid (comparison buttons still accessible)

---

## 9. Success Metrics & Measurement

### 9.1 Key Performance Indicators

| Metric | Current Baseline | Phase 1 Target |
|--------|-----------------|-----------------|
| Leads/month | TBD | +150% |
| Form completion rate | N/A | >40% |
| Comparison tool usage | 0% | >25% of visitors |
| Avg. time on site | TBD | +30% |
| Agent follow-up time | N/A | <2 hours |
| Conversion rate (lead→visit) | TBD | >35% |

### 9.2 Tracking Implementation
- Google Analytics 4: Track comparison tool usage
- Form submission tracking: Count, completion rate, drop-off points
- Heat mapping: See where users interact most
- Lead source tracking: Which property/CTA generates most leads

---

## 10. Timeline & Dependencies

**Phase 1 (MVP):** 2-3 weeks
- Week 1: Component development + backend setup
- Week 2: Form optimization + property comparison logic
- Week 3: Testing, refinements, deployment

**No external dependencies** (all integrations can be done later in Phase 2)

---

## 11. Risk Mitigation

### 11.1 Potential Issues
- **Risk:** Form abandonment due to complexity
  - **Mitigation:** Progressive disclosure, pre-fill data, mobile optimization

- **Risk:** Poor comparison tool performance with large datasets
  - **Mitigation:** Optimize queries, lazy load, pagination if needed

- **Risk:** Agents overwhelmed by leads
  - **Mitigation:** Lead qualification, priority sorting by intent level

- **Risk:** Users don't use comparison tool
  - **Mitigation:** A/B test CTAs, improve discoverability, educate through copy

---

## 12. Future Enhancements (Phase 2)

- Personalized property recommendations (based on browsing)
- Lead scoring (automatic qualification)
- Chat widget with AI (instant questions)
- Exclusive/off-market properties for qualified leads
- Investment calculator (ROI modeling)
- CRM integration (full pipeline management)

---

## Approval Checklist

- [ ] Design aligns with Montana Realty brand (premium, elegant)
- [ ] User flow is intuitive (discovery → interaction → action)
- [ ] Lead capture is non-intrusive but effective
- [ ] Mobile experience is optimized
- [ ] Success metrics are clear and measurable
- [ ] Implementation is achievable in 2-3 weeks

---

**Document prepared by:** Claude Haiku 4.5  
**Status:** Ready for deep-research validation
