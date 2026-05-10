# RTL Layout Toggle - Testing Guide

## How to Test the RTL Implementation

### Prerequisites
- Frontend dev server running on http://localhost:5174
- Backend server running on http://localhost:5000

### Manual Testing Steps

#### 1. Initial State Test
1. Open browser and navigate to http://localhost:5174
2. Open browser DevTools (F12)
3. Check the Console tab - should have no errors
4. In the Elements tab, inspect the `<html>` element
5. Verify attributes:
   - `dir="ltr"` (default)
   - `lang="en"` (default)

#### 2. Language Toggle Test (Desktop)
1. Look at the header navigation bar
2. Find the language toggle button (should show "AR" icon)
3. Click the language toggle button
4. Observe:
   - Layout flips to RTL (right-to-left)
   - Button now shows "EN"
   - Font changes to Cairo (Arabic font)
   - All navigation items flip to the right side
   - Logo moves to the right
   - Menu items align to the right

#### 3. Language Toggle Test (Mobile)
1. Resize browser window to mobile size (< 768px) or use DevTools device emulation
2. Click the hamburger menu icon (☰)
3. Find "Language: English" button in the menu
4. Click it
5. Observe:
   - Layout flips to RTL
   - Button text changes to "Language: العربية"
   - Menu items align to the right
   - Icons flip to the right side

#### 4. Persistence Test
1. Toggle language to Arabic (RTL mode)
2. Refresh the page (F5)
3. Verify:
   - Page loads in RTL mode
   - Language preference is maintained
   - No flash of LTR content

4. Open browser DevTools → Application → Local Storage
5. Find key: `aqar_language`
6. Value should be: `"ar"`

#### 5. Document Attributes Test
1. With Arabic selected, inspect `<html>` element
2. Verify:
   - `dir="rtl"`
   - `lang="ar"`

3. Toggle back to English
4. Verify:
   - `dir="ltr"`
   - `lang="en"`

#### 6. Font Test
1. Toggle to Arabic (RTL mode)
2. Inspect any text element in DevTools
3. Check Computed styles
4. Verify font-family includes "Cairo"

#### 7. Layout Flip Test
Visit different pages and verify RTL layout works correctly:

**Home Page** (http://localhost:5174):
- Hero section text aligns right
- Search filters align right
- Property cards flip layout

**Search Page** (http://localhost:5174/search):
- Filters sidebar moves to right
- Property grid maintains proper spacing
- Map controls flip

**Property Detail** (http://localhost:5174/properties/:id):
- Image gallery navigation flips
- Property details align right
- Contact form aligns right

**Dashboard** (http://localhost:5174/dashboard):
- Sidebar navigation flips
- Property listings align right
- Action buttons flip

#### 8. Multiple Toggle Test
1. Toggle language 5 times rapidly
2. Verify:
   - No errors in console
   - Layout updates smoothly each time
   - localStorage updates correctly
   - No memory leaks

#### 9. Cross-Browser Test
Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

#### 10. Accessibility Test
1. Toggle to RTL mode
2. Use keyboard navigation (Tab key)
3. Verify:
   - Focus order follows RTL direction
   - All interactive elements are accessible
   - Screen reader announces direction change

### Expected Behavior

#### When English (LTR) is Active:
- `dir="ltr"` on `<html>`
- `lang="en"` on `<html>`
- Layout flows left-to-right
- Text aligns left
- Navigation on the left
- Font: DM Sans
- Toggle button shows: "AR"

#### When Arabic (RTL) is Active:
- `dir="rtl"` on `<html>`
- `lang="ar"` on `<html>`
- Layout flows right-to-left
- Text aligns right
- Navigation on the right
- Font: Cairo
- Toggle button shows: "EN"

### Common Issues & Solutions

#### Issue: Layout doesn't flip
**Solution**: Check browser console for errors. Ensure LanguageProvider is wrapping the app.

#### Issue: Font doesn't change
**Solution**: Verify Cairo font is loaded. Check Network tab for font file requests.

#### Issue: Preference not persisting
**Solution**: Check localStorage is enabled. Some browsers block it in private mode.

#### Issue: Toggle button not visible
**Solution**: Check Header component is rendering. Verify lucide-react is installed.

### Automated Test Verification

Run the test suite:
```bash
cd aqar/client
npm test
```

Expected output:
```
✓ src/context/LanguageContext.test.jsx (15 tests) 15 passed
  ✓ LanguageProvider initialization (4)
  ✓ toggleLanguage (3)
  ✓ setLanguage (3)
  ✓ localStorage persistence (2)
  ✓ useLanguage hook (2)
  ✓ Document attribute updates (1)

Test Files  1 passed (1)
Tests  15 passed (15)
```

### Visual Checklist

Use this checklist while testing:

- [ ] Language toggle button visible in header (desktop)
- [ ] Language toggle button visible in mobile menu
- [ ] Clicking toggle switches language
- [ ] Layout direction changes (LTR ↔ RTL)
- [ ] Font changes to Cairo in RTL mode
- [ ] Document attributes update (`dir` and `lang`)
- [ ] Preference persists after page refresh
- [ ] localStorage stores language preference
- [ ] No console errors
- [ ] All pages work in both modes
- [ ] Navigation items flip correctly
- [ ] Forms align correctly in RTL
- [ ] Buttons and icons flip correctly
- [ ] Text alignment changes appropriately
- [ ] Smooth transitions between modes

### Performance Check

1. Open DevTools → Performance tab
2. Start recording
3. Toggle language 3 times
4. Stop recording
5. Verify:
   - No long tasks (> 50ms)
   - No layout thrashing
   - Smooth 60fps transitions

### Success Criteria

✅ All 15 automated tests pass  
✅ Manual testing checklist complete  
✅ No console errors or warnings  
✅ Layout flips correctly in all pages  
✅ Font changes to Cairo in RTL mode  
✅ Preference persists across sessions  
✅ Works on desktop and mobile  
✅ Accessible via keyboard  
✅ Cross-browser compatible  

---

## Quick Test Commands

```bash
# Run automated tests
npm test

# Run tests in watch mode
npm run test:watch

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Screenshots Locations

When testing, take screenshots of:
1. English (LTR) mode - Desktop
2. Arabic (RTL) mode - Desktop
3. English (LTR) mode - Mobile
4. Arabic (RTL) mode - Mobile
5. localStorage showing `aqar_language` key
6. DevTools showing `dir` and `lang` attributes

---

## Reporting Issues

If you find any issues during testing:

1. Note the browser and version
2. Describe the steps to reproduce
3. Include console errors (if any)
4. Take a screenshot
5. Check if issue occurs in both LTR and RTL modes

---

**Last Updated**: January 2025  
**Task**: 23.1 - RTL Layout Toggle  
**Status**: Ready for Testing ✅
