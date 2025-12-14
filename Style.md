🎨 DESIGN SYSTEM PROMPT — CSS & STYLE SPECIFICATION
🧠 Project Context

Design a mobile-first community application for the Iranian community residing in Germany.

The interface must convey modernity, professionalism, trust, and inclusivity, while maintaining a culturally neutral and internationally polished aesthetic.

The application must fully support Persian (RTL) and German (LTR) languages with equal quality and consistency.

🎯 Design Principles

Minimalist yet warm visual language

Contemporary European product design aesthetic

Clear structure and strong visual hierarchy

Content-first approach with no decorative clutter

Accessibility, readability, and usability as primary priorities

🎨 Color System (CSS Variables Required)
Primary Colors

Primary Blue: #1F3A5F — brand anchor, trust, reliability

Primary Blue Light: #2F5D8A — interactive and hover states

Accent Colors

Accent Green: #2FA36B — community, growth, positive actions

Accent Green Soft: #E6F4EE — backgrounds and subtle highlights

Neutral Palette

App Background: #F7F9FC

Surface / Card Background: #FFFFFF

Divider / Border Light: #E3E8EF

Text Colors

Primary Text: #1E293B

Secondary Text: #64748B

Muted / Helper Text: #94A3B8

System States

Success: #22C55E

Warning: #F59E0B

Error: #EF4444

Informational: #3B82F6

✍️ Typography System
Font Family

Primary: "Inter", "Vazirmatn", system-ui, sans-serif

Must fully support Persian (Arabic script) and Latin characters

Font Scale

Heading XL: 24px

Heading L: 20px

Heading M: 18px

Body (Primary): 16px

Body (Secondary): 14–15px

Caption / Label: 12px

Font Weights

Headings: 600–700

Body text: 400–500

Buttons & UI labels: 600

Line Height

Headings: 1.3

Body text: 1.6

📐 Spacing & Layout Tokens

Use a 4px-based spacing system across the entire interface.

Spacing Scale

XS: 4px

SM: 8px

MD: 16px

LG: 24px

XL: 32px

XXL: 40px

Page Padding

Horizontal: 16px

Vertical: 16–24px

Vertical Rhythm

Section separation: 24px

Card separation: 16px

🧱 Layout Patterns
Global Layout

Mobile-first architecture

Maximum content width: 480px

Center-aligned content container

Single-column flow

Persistent bottom navigation

Card Component

Background: #FFFFFF

Border radius: 16px

Internal padding: 16px

Shadow:

0 8px 24px rgba(0, 0, 0, 0.05)

Bottom margin: 16px

List Item Component

Horizontal padding: 16px

Vertical padding: 12px

Divider color: #E3E8EF

Optional leading or trailing icon support

Bottom Navigation

Height: 64px

Background: #FFFFFF

Top border: 1px solid #E3E8EF

Icon size: 22px

Active state color: Primary Blue

Inactive state color: Muted text

🔘 Button System
Primary Button

Background: Primary Blue

Text color: White

Height: 48px

Horizontal padding: 20px

Border radius: 14px

Font weight: 600

Shadow:

0 4px 12px rgba(31, 58, 95, 0.25)

Secondary Button

Background: Transparent

Border: 1px solid #CBD5E1

Text color: Primary Blue

Button States

Hover: Slight color darkening

Active: Scale to 0.98

Disabled: Opacity 0.5, no shadow

🧾 Form Controls
Input Fields

Height: 48px

Horizontal padding: 14px

Border radius: 12px

Border: 1px solid #CBD5E1

Background: White

Focus State

Border color: Primary Blue

Focus ring:

0 0 0 3px rgba(31, 58, 95, 0.15)

🔁 RTL / LTR Language Support

Use logical CSS properties:

padding-inline

margin-inline

Text alignment follows document direction

Icons and navigation order mirrored in RTL

Layout symmetry preserved across directions

✨ Motion & Interaction

Transition duration: 200–300ms

Timing function: ease-out

Allowed effects:

Fade

Slide-up

Avoid elastic, bounce, or playful animations

♿ Accessibility Requirements

Minimum color contrast: WCAG AA

Minimum tap target size: 44px

Do not rely on color alone for state indication

Visible and consistent focus indicators

🛠 Implementation Guidelines for AI

All colors, spacing, and sizes must use CSS variables

Component-based and reusable styling

Semantic, readable class naming

No inline styles

Architecture must allow future dark-mode extension
