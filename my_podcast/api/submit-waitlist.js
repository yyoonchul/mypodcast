// Waitlist API handler using Vercel Edge Config
const { get, createClient } = require('@vercel/edge-config');

// Memory fallback storage
const tempStorage = [];

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, podcastType, selectedTopics, selectedJobRoles, wantProPlan, createdAt } = req.body;
    
    // Validate required fields
    if (!email || !podcastType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new submission
    const newSubmission = {
      id: `wait_${Date.now()}`,
      email,
      podcastType,
      selectedTopics: selectedTopics || [],
      selectedJobRoles: selectedJobRoles || [],
      wantProPlan: wantProPlan || false,
      createdAt: createdAt || new Date().toISOString()
    };

    // Log for debugging
    console.log('New waitlist submission:', JSON.stringify(newSubmission));
    
    // Store the submission
    try {
      if (process.env.EDGE_CONFIG && process.env.VERCEL_API_TOKEN) {
        console.log('Attempting to use Edge Config...');
        
        // 1. Get current waitlist data using edge-config package
        let waitlist = [];
        try {
          // Create the Edge Config client
          const edgeConfig = createClient(process.env.EDGE_CONFIG);
          waitlist = await edgeConfig.get('waitlist') || [];
          console.log(`Found ${waitlist.length} existing entries in Edge Config`);
        } catch (readError) {
          console.error('Error reading from Edge Config:', readError);
          console.log('Using empty waitlist array');
        }
        
        // 2. Add new submission
        waitlist.push(newSubmission);
        
        // 3. Update Edge Config using Vercel API
        // Extract Edge Config ID from connection string
        const connectionString = process.env.EDGE_CONFIG;
        const url = new URL(connectionString);
        const pathSegments = url.pathname.split('/');
        const edgeConfigId = pathSegments[pathSegments.length - 1];
        
        const updateResponse = await fetch(
          `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  operation: 'upsert',
                  key: 'waitlist',
                  value: waitlist,
                },
              ],
            }),
          }
        );
        
        if (updateResponse.ok) {
          console.log('Successfully saved to Edge Config');
        } else {
          const errorData = await updateResponse.json();
          throw new Error(`Edge Config update failed: ${JSON.stringify(errorData)}`);
        }
      } else {
        // Edge Config not configured, use temporary storage
        tempStorage.push(newSubmission);
        console.log(`Saved to temporary storage (${tempStorage.length} total entries)`);
      }
    } catch (storageError) {
      // Fallback to memory storage
      console.error('Error with Edge Config, using temp storage:', storageError);
      tempStorage.push(newSubmission);
    }

    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waitlist' 
    });
  } catch (error) {
    console.error('Global error in waitlist API:', error);
    return res.status(500).json({ 
      error: 'Failed to process submission', 
      message: 'Please try again later' 
    });
  }
};