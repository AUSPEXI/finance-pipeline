# SDSP Finance Suite Deployment Guide

This guide covers deploying the SDSP Finance Suite App to various platforms with proper GitHub integration.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+
- GitHub account
- Netlify account
- Supabase project

### 1. GitHub Repository Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: SDSP Finance Suite App with zk-SNARKs"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/SDSP-Finance-Suite.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Environment Variables Setup

#### GitHub Secrets (for CI/CD)
Add these secrets in your GitHub repository settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
VITE_BLOOMBERG_API_KEY=your_bloomberg_api_key
VITE_FCA_API_KEY=your_fca_api_key
VITE_SEC_API_KEY=your_sec_api_key
VITE_REUTERS_API_KEY=your_reuters_api_key
VITE_DATABRICKS_API_URL=your_databricks_url
VITE_DATABRICKS_API_KEY=your_databricks_key
VITE_SNOWFLAKE_API_URL=your_snowflake_url
VITE_SNOWFLAKE_API_KEY=your_snowflake_key
VITE_DATARADE_API_URL=your_datarade_url
VITE_DATARADE_API_KEY=your_datarade_key
VITE_BRIGHTDATA_API_URL=your_brightdata_url
VITE_BRIGHTDATA_API_KEY=your_brightdata_key
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
```

#### Netlify Environment Variables
Set the same variables in your Netlify dashboard under Site Settings > Environment Variables.

### 3. Supabase Database Setup

```sql
-- Run these migrations in order:
-- 1. supabase/migrations/20250610195725_spring_surf.sql
-- 2. supabase/migrations/20250611131858_weathered_glade.sql
-- 3. supabase/migrations/20250613202305_green_cave.sql
-- 4. supabase/migrations/20250613202815_yellow_breeze.sql
-- 5. supabase/migrations/20250626003211_dusty_recipe.sql
-- 6. supabase/migrations/20250626080913_curly_night.sql
-- 7. supabase/migrations/20250626140327_quick_rice.sql
```

### 4. Netlify Deployment

#### Option A: Automatic Deployment (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to `main`

#### Option B: Manual Deployment
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 Advanced Configuration

### GitHub Actions Workflow
The included `.github/workflows/deploy.yml` provides:
- Automatic testing on pull requests
- Automatic deployment to Netlify on main branch
- Environment variable injection
- Build optimization

### Performance Optimization
- **Build Time**: ~2-3 minutes
- **Bundle Size**: Optimized with Vite
- **CDN**: Netlify global CDN
- **Serverless Functions**: Netlify Functions for data processing

### Security Configuration
- **HTTPS**: Enforced by default
- **Headers**: Security headers configured in `netlify.toml`
- **Environment Variables**: Encrypted in Netlify/GitHub
- **zk-SNARKs**: Zero-knowledge proof validation

## 📊 Monitoring and Analytics

### Performance Monitoring
```javascript
// Add to your analytics dashboard
const performanceMetrics = {
  dailyRecords: 1000000,
  processingSpeed: '576 records/sec',
  uptime: '99.9%',
  zkProofValidation: 'Active'
};
```

### Error Tracking
- GitHub Issues for bug tracking
- Netlify Analytics for performance
- Supabase logs for database monitoring

## 🚀 Production Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Tests passing
- [ ] Security headers configured
- [ ] zk-SNARK proofs validated

### Post-Deployment
- [ ] Verify all 8 finance suites working
- [ ] Test marketplace integrations
- [ ] Validate FCA/SEC compliance
- [ ] Monitor performance metrics
- [ ] Check error rates

### Finance Suite Validation
```bash
# Test each suite endpoint
curl https://your-site.netlify.app/api/suite/CREDRISE
curl https://your-site.netlify.app/api/suite/TRADEMARKET
curl https://your-site.netlify.app/api/suite/CASHFLOW
# ... test all 8 suites
```

## 🔒 Security Considerations

### API Keys Management
- Never commit API keys to repository
- Use GitHub Secrets for CI/CD
- Rotate keys regularly
- Monitor usage and access

### Compliance Requirements
- **FCA Compliance**: UK financial data regulations
- **SEC Compliance**: US securities regulations
- **UK GDPR**: Data protection requirements
- **ISO 27001**: Information security standards

### zk-SNARKs Security
- Validate all proofs before database insertion
- Maintain cryptographic integrity
- Regular security audits
- Zero-knowledge validation

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues
```bash
# Verify variables are set
echo $VITE_SUPABASE_URL
netlify env:list
```

#### Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/finance_data?select=*&limit=1"
```

### Performance Issues
- Check Netlify function logs
- Monitor Supabase performance
- Verify CDN cache settings
- Optimize bundle size

## 📞 Support

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and examples
- **Community**: GitHub Discussions
- **Security**: security@auspexi.com

### Useful Links
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AUSPEXI Finance Suite](https://auspexi.com)

---

**SDSP Finance Suite**: Secure Data Sharing Platform with zk-SNARKs, delivering 1M records/day across 8 finance suites with FCA/SEC compliance.