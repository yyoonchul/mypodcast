export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, podcastType, selectedTopics, selectedJobRoles, wantProPlan, createdAt } = req.body;

    // Validate required fields
    if (!email || !podcastType || !selectedTopics || !createdAt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new submission
    const newSubmission = {
      email,
      podcastType,
      selectedTopics,
      selectedJobRoles: selectedJobRoles || [],
      wantProPlan: wantProPlan || false,
      createdAt,
    };

    // Create a simple way to store waitlist entries
    // This is a temporary solution using environment variables
    const waitlistData = process.env.WAITLIST_DATA 
      ? JSON.parse(process.env.WAITLIST_DATA) 
      : [];
    
    waitlistData.push(newSubmission);
    
    // Note: In a production app, you would store this in a database
    // This is just for demonstration purposes
    console.log('New waitlist submission:', newSubmission);
    console.log('Total waitlist entries:', waitlistData.length);

    return res.status(200).json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 