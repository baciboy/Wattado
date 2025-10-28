# Wattado - TODO List

This document tracks upcoming tasks and features to be implemented.

## High Priority

### Email & Authentication

#### ✉️ SMTP Setup for Production Email Delivery
**Status:** Pending
**Priority:** Medium (Required before production launch)
**Estimated Time:** 2-3 hours

**Description:**
Set up custom SMTP for reliable email delivery in production. Currently using Supabase default email service which has rate limits (3-4 emails/hour) and may go to spam.

**Tasks:**
1. **Choose SMTP Provider**
   - [ ] Research and select provider (SendGrid, AWS SES, Mailgun, or Postmark)
   - [ ] Compare pricing and features
   - [ ] Sign up for free tier or paid plan

2. **Configure SMTP Provider**
   - [ ] Create API keys/credentials
   - [ ] Verify domain ownership (if using custom domain)
   - [ ] Set up SPF, DKIM, and DMARC DNS records for deliverability
   - [ ] Test email sending from provider dashboard

3. **Integrate with Supabase**
   - [ ] Navigate to Supabase Dashboard → Authentication → SMTP Settings
   - [ ] Enter SMTP credentials:
     - Host (e.g., smtp.sendgrid.net)
     - Port (usually 587 or 465)
     - Username
     - Password/API Key
     - Sender email (e.g., noreply@wattado.com)
     - Sender name (e.g., "Wattado")
   - [ ] Test configuration with Supabase's test email feature

4. **Update Email Templates** (Optional)
   - [ ] Customize password reset email template
   - [ ] Customize confirmation email template
   - [ ] Add branding and styling to emails
   - [ ] Test templates with actual password reset flow

5. **Environment Variables** (if needed)
   - [ ] Add SMTP credentials to `.env` file (if handling server-side)
   - [ ] Update production environment variables
   - [ ] Document configuration in deployment guide

6. **Testing & Validation**
   - [ ] Test password reset emails go to inbox (not spam)
   - [ ] Test email delivery speed (should be < 10 seconds)
   - [ ] Test high volume scenarios (rate limits)
   - [ ] Check email deliverability with mail-tester.com

**Resources:**
- [Supabase SMTP Docs](https://supabase.com/docs/guides/auth/auth-smtp)
- [SendGrid Setup Guide](https://sendgrid.com/docs/for-developers/)
- [AWS SES Setup](https://docs.aws.amazon.com/ses/latest/dg/setting-up.html)
- [Email Authentication (SPF/DKIM)](https://postmarkapp.com/guides/spf)

**Notes:**
- Default Supabase email works for development/testing
- Custom SMTP mainly needed for:
  - Production launch with real users
  - Higher email volume (>3 emails/hour)
  - Better deliverability (avoid spam folder)
  - Custom domain branding

---

## Medium Priority

### Features from PRD

- [ ] **Custom Event Lists Management UI**
  - Create, edit, delete custom lists
  - Add/remove events from lists
  - Share lists with friends

- [ ] **AI Chatbot Widget**
  - Interactive chatbot UI (currently only search bar works)
  - Conversation history
  - Context-aware recommendations

- [ ] **Social Sharing Features**
  - Share events via WhatsApp
  - Share to Facebook, Twitter, Instagram
  - Generate shareable links with preview cards

- [ ] **Friends & Group Planning**
  - Friend system (add, remove, list friends)
  - Group creation and management
  - Group event planning and voting

- [ ] **Analytics Tracking**
  - User behavior tracking
  - Event view/click analytics
  - Search query analysis
  - A/B testing framework

### Technical Improvements

- [ ] **Phone Authentication**
  - Complete phone login flow (UI exists but not functional)
  - SMS verification with Twilio or similar

- [ ] **Facebook OAuth**
  - Connect Facebook OAuth (button exists but not functional)
  - Handle Facebook login flow

- [ ] **Event Source Expansion**
  - Integrate Eventbrite API
  - Integrate StubHub API
  - Integrate SeatGeek API
  - Integrate Vivid Seats API

- [ ] **Performance Optimization**
  - Implement event caching
  - Lazy load images
  - Optimize bundle size
  - Add service worker for offline support

---

## Low Priority / Future Enhancements

- [ ] **User Preferences**
  - Save preferred categories
  - Save preferred locations
  - Notification preferences

- [ ] **Calendar Integration**
  - Add to Google Calendar
  - Add to Apple Calendar
  - iCal export

- [ ] **Event Reminders**
  - Email reminders before events
  - Push notifications (requires PWA)

- [ ] **Reviews & Ratings**
  - User reviews for events
  - Star ratings
  - Photo uploads

- [ ] **Advanced Filters**
  - Filter by accessibility features
  - Filter by age restrictions
  - Filter by parking availability
  - Filter by public transport access

---

## Completed Tasks

- ✅ Ticketmaster API integration
- ✅ Event browsing and filtering
- ✅ Event grouping (same event, multiple dates)
- ✅ Responsive UI with Tailwind CSS
- ✅ Email/password authentication with Supabase
- ✅ Favorites system with Supabase
- ✅ AI-powered natural language search
- ✅ Forgot password functionality
- ✅ Password reset flow

---

## Notes

- Refer to `eventfinder_prd.md` for detailed feature specifications
- Check `.claude/CLAUDE.md` for project guidelines and architecture
- See `docs/` folder for technical documentation
