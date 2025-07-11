import { createClient } from '@supabase/supabase-js';
import { batchInsertChangesData } from '../src/services/database/optimizedSupabaseClient.js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced mock RSS data generator for high-volume testing
const generateMockRSSData = (count = 100) => {
  const locations = [
    'USA', 'Europe', 'Asia', 'Africa', 'Canada', 'UK', 'Australia', 'Brazil', 'India', 'China',
    'Germany', 'France', 'Japan', 'South Korea', 'Mexico', 'Argentina', 'South Africa', 'Nigeria',
    'Egypt', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Malaysia', 'Singapore'
  ];
  
  const events = [
    'flu', 'covid', 'measles', 'malaria', 'dengue', 'tuberculosis', 'pneumonia', 'hepatitis',
    'cholera', 'typhoid', 'zika', 'ebola', 'mpox', 'norovirus', 'rsv', 'strep', 'meningitis'
  ];
  
  const sources = ['WHO', 'CDC', 'Johns Hopkins', 'Google Trends', 'Reuters Health', 'BBC Health'];
  
  return Array.from({ length: count }, (_, i) => {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const event = events[Math.floor(Math.random() * events.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const sentiment = Math.random();
    
    let sentimentType = 'neutral';
    if (sentiment > 0.6) sentimentType = 'positive';
    else if (sentiment < 0.4) sentimentType = 'negative';
    
    // Generate realistic timestamps (spread over last 24 hours)
    const hoursAgo = Math.random() * 24;
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    return {
      title: `${event.charAt(0).toUpperCase() + event.slice(1)} ${
        Math.random() > 0.5 ? 'outbreak' : 'cases'
      } reported in ${location}`,
      contentSnippet: `Health authorities in ${location} report ${
        Math.random() > 0.5 ? 'new' : 'increased'
      } cases of ${event}. ${
        sentimentType === 'positive' ? 'Response measures showing effectiveness.' :
        sentimentType === 'negative' ? 'Concerns raised about containment.' :
        'Situation being monitored closely.'
      }`,
      pubDate: timestamp,
      location,
      event,
      sentiment: Math.round(sentiment * 100) / 100,
      sentimentType,
      source,
      id: `mock-${Date.now()}-${i}`
    };
  });
};

// Generate simulation data
const generateSimulation = (sentiment) => {
  const baseInfected = Math.floor(Math.random() * 2000) + 500;
  const baseRecovered = Math.floor(Math.random() * 1500) + 300;
  const baseSusceptible = Math.floor(Math.random() * 8000) + 2000;
  const spreadRate = Math.round((0.1 + Math.random() * 0.4) * 100) / 100;
  
  // Adjust based on sentiment
  const sentimentFactor = sentiment;
  const infected = Math.round(baseInfected * (1.5 - sentimentFactor));
  const recovered = Math.round(baseRecovered * (1 + sentimentFactor));
  const susceptible = Math.round(baseSusceptible * (1 + sentimentFactor * 0.5));
  
  return {
    infected,
    recovered,
    susceptible,
    spreadRate
  };
};

// Generate narrative
const generateNarrative = (item) => {
  const templates = {
    positive: [
      `${item.event.charAt(0).toUpperCase() + item.event.slice(1)} response in ${item.location} shows ${Math.round(item.sentiment * 100)}% positive public health sentiment with effective containment measures.`,
      `Health authorities in ${item.location} report successful ${item.event} management with ${Math.round(item.sentiment * 100)}% community confidence in prevention efforts.`,
      `${item.location} demonstrates strong ${item.event} preparedness with ${Math.round(item.sentiment * 100)}% positive public response to health interventions.`
    ],
    negative: [
      `${item.event.charAt(0).toUpperCase() + item.event.slice(1)} outbreak in ${item.location} correlates with ${Math.round(item.sentiment * 100)}% negative public health sentiment and containment challenges.`,
      `Concerns mount in ${item.location} as ${item.event} cases rise amid ${Math.round(item.sentiment * 100)}% negative public confidence in response measures.`,
      `${item.location} faces ${item.event} challenges with ${Math.round(item.sentiment * 100)}% negative public perception of health system readiness.`
    ],
    neutral: [
      `${item.event.charAt(0).toUpperCase() + item.event.slice(1)} situation in ${item.location} shows ${Math.round(item.sentiment * 100)}% neutral public sentiment as authorities monitor developments.`,
      `Health officials in ${item.location} track ${item.event} cases with ${Math.round(item.sentiment * 100)}% balanced public health sentiment.`,
      `${item.location} maintains steady ${item.event} surveillance with ${Math.round(item.sentiment * 100)}% neutral community response to health measures.`
    ]
  };
  
  const narrativeOptions = templates[item.sentimentType] || templates.neutral;
  const text = narrativeOptions[Math.floor(Math.random() * narrativeOptions.length)];
  const confidence = 0.7 + Math.random() * 0.25; // 0.7-0.95
  
  return {
    text,
    confidence: Math.round(confidence * 100) / 100
  };
};

// Main high-volume scraping function
const scrapeHighVolumeData = async () => {
  console.log('🚀 Starting CHANGES high-volume data scraping...');
  console.log('📊 Target: 20,000 records/day (simulating with smaller batches)');
  
  const startTime = Date.now();
  
  try {
    // Generate larger batch for high-volume simulation
    const batchSize = 500; // Simulate processing 500 records at a time
    const mockData = generateMockRSSData(batchSize);
    
    console.log(`📦 Generated ${mockData.length} mock records for processing`);
    
    // Process data into Supabase format
    const processedData = mockData.map(item => {
      const simulation = generateSimulation(item.sentiment);
      const narrative = generateNarrative(item);
      
      return {
        source: item.source,
        data: {
          id: item.id,
          title: item.title,
          content: item.contentSnippet,
          pubDate: item.pubDate,
          processed_at: new Date().toISOString(),
          narrative,
          simulation
        },
        location: item.location,
        event: item.event,
        sentiment: item.sentiment,
        sentiment_type: item.sentimentType,
        timestamp: item.pubDate
      };
    });
    
    console.log('⚡ Starting optimized batch insert...');
    const batchStartTime = Date.now();
    
    // Use optimized batch insert
    const result = await batchInsertChangesData(processedData);
    
    const batchTime = Date.now() - batchStartTime;
    const totalTime = Date.now() - startTime;
    
    if (result.success) {
      const recordsPerSecond = Math.round((result.inserted / batchTime) * 1000);
      
      console.log('✅ High-volume scraping completed successfully!');
      console.log(`📈 Performance Metrics:`);
      console.log(`   • Records processed: ${result.inserted}/${processedData.length}`);
      console.log(`   • Batch insert time: ${batchTime}ms`);
      console.log(`   • Total processing time: ${totalTime}ms`);
      console.log(`   • Processing speed: ${recordsPerSecond} records/second`);
      console.log(`   • Success rate: ${((result.inserted / processedData.length) * 100).toFixed(1)}%`);
      
      if (result.failed > 0) {
        console.warn(`⚠️  ${result.failed} records failed to insert`);
        console.warn(`   Errors: ${result.errors.slice(0, 3).join(', ')}${result.errors.length > 3 ? '...' : ''}`);
      }
      
      // Extrapolate to daily capacity
      const dailyCapacity = Math.round(recordsPerSecond * 60 * 60 * 24);
      console.log(`🎯 Estimated daily capacity: ${dailyCapacity.toLocaleString()} records/day`);
      
      if (dailyCapacity >= 20000) {
        console.log('✅ System meets 20,000 records/day target!');
      } else {
        console.log(`⚠️  System needs optimization for 20,000 records/day target`);
      }
      
    } else {
      console.error('❌ Batch insert failed:', result.errors);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 High-volume scraping error:', error);
    process.exit(1);
  }
};

// Run the high-volume scraper
scrapeHighVolumeData().catch(console.error);
