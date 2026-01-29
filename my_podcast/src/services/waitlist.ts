interface WaitlistData {
  email: string;
  podcastType: 'news' | 'career';
  selectedTopics?: string[];
  selectedJobRoles?: string[];
  wantProPlan: boolean;
}

export const submitWaitlistData = async (data: WaitlistData): Promise<void> => {
  try {
    const response = await fetch('/api/submit-waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit waitlist data');
    }
    
    return;
  } catch (error) {
    console.error('Error submitting waitlist:', error);
    throw error;
  }
};
