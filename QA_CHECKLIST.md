# Quality Assurance Checklist - Houston Marketing Coach

## 🎯 LANDING PAGE QA

### Visual Design
- [ ] Hero section displays correctly
- [ ] Features cards have visible borders and glassmorphism
- [ ] Pricing cards display correctly (Free vs Pro)
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Testimonials section visible
- [ ] Trust badges visible
- [ ] Footer displays correctly with all columns
- [ ] Social media icons visible and clickable
- [ ] Newsletter form displays correctly
- [ ] Text contrast meets WCAG 2.2 AA standards
- [ ] Gradient text renders correctly
- [ ] Star animation works

### Navigation
- [ ] Logo links to home
- [ ] Features link scrolls to features section
- [ ] Pricing link scrolls to pricing section
- [ ] Language switcher works (DE/EN)
- [ ] Mobile hamburger menu appears on mobile
- [ ] Mobile menu opens/closes correctly
- [ ] Mobile menu links work
- [ ] "Go to Dashboard" button works when logged in
- [ ] "Login" button works when logged out

### Functionality
- [ ] FAQ items expand/collapse
- [ ] Chevron icons rotate on FAQ open/close
- [ ] Newsletter email input accepts text
- [ ] Newsletter subscribe button clickable
- [ ] All footer links are clickable
- [ ] Social media links open in new tab
- [ ] CTA buttons have hover effects
- [ ] Cards have hover effects

### Responsive Design
- [ ] Desktop (1920px) layout correct
- [ ] Tablet (768px) layout correct
- [ ] Mobile (375px) layout correct
- [ ] Hamburger menu only visible on mobile
- [ ] Footer stacks correctly on mobile
- [ ] Pricing cards stack on mobile
- [ ] Features cards stack on mobile

### Content
- [ ] All text is readable (no lorem ipsum)
- [ ] Translations work (DE/EN)
- [ ] Pricing information accurate
- [ ] FAQ answers comprehensive
- [ ] No spelling errors
- [ ] No broken images

---

## 📱 APP QA

### Authentication
- [ ] Login flow works
- [ ] Logout works
- [ ] Session persists on refresh
- [ ] Redirect to dashboard after login
- [ ] Redirect to landing page after logout
- [ ] Protected routes require authentication

### Dashboard Layout
- [ ] Sidebar navigation visible
- [ ] Logo in sidebar
- [ ] Navigation items clickable
- [ ] User profile shows in sidebar
- [ ] Logout button in sidebar
- [ ] Main content area displays correctly
- [ ] No layout shifts or jumps

### Workspaces
- [ ] List workspaces
- [ ] Create new workspace
- [ ] Switch between workspaces
- [ ] Default workspace created on first login
- [ ] Workspace name displays in UI

### Goals Management
- [ ] View goals list
- [ ] Create new goal
- [ ] Edit goal
- [ ] Delete goal
- [ ] Goal status updates
- [ ] Goal progress displays correctly
- [ ] Empty state shows when no goals

### Tasks/Todos Management
- [ ] View todos list
- [ ] Create new todo
- [ ] Edit todo
- [ ] Delete todo
- [ ] Mark todo as complete
- [ ] Todo status toggles
- [ ] Empty state shows when no todos

### AI Chat
- [ ] Chat interface displays
- [ ] Send message works
- [ ] AI response appears
- [ ] Chat history persists
- [ ] Markdown rendering works
- [ ] Code blocks render correctly
- [ ] Chat counter increments
- [ ] Plan limit warning shows when approaching limit
- [ ] Error handling for failed messages

### Plan Limits
- [ ] Chat counter displays correctly
- [ ] Free plan: 20 chats limit enforced
- [ ] Pro plan: 200 chats limit enforced
- [ ] Limit resets monthly
- [ ] Warning shows at 80% usage
- [ ] Block chat when limit reached

### UI/UX Consistency
- [ ] Color scheme consistent
- [ ] Typography consistent
- [ ] Button styles consistent
- [ ] Form inputs consistent
- [ ] Loading states present
- [ ] Error messages clear
- [ ] Success messages clear
- [ ] Hover effects consistent
- [ ] Focus states visible
- [ ] Spacing consistent

### Performance
- [ ] Page load time < 3s
- [ ] No console errors
- [ ] No console warnings
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Smooth animations

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader friendly

---

## 🧪 TECHNICAL QA

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests passing (21/21)
- [ ] No unused imports
- [ ] No console.log statements in production

### Database
- [ ] Migrations applied
- [ ] Schema matches code
- [ ] Indexes present
- [ ] Foreign keys correct

### API
- [ ] All endpoints working
- [ ] Error handling present
- [ ] Authentication middleware works
- [ ] Rate limiting present
- [ ] CORS configured correctly

---

## 🐛 BUGS FOUND

(Will be populated during testing)

---

## ✅ IMPROVEMENTS NEEDED

(Will be populated during testing)
